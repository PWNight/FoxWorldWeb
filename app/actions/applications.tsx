import {
    SignupFormSchema,
    FormState,
    GuildApplicationFormSchema,
    GuildApplicationFormState,
    VerifyApplicationFormState,
    VerifyApplicationFormSchema
} from '@/lib/definitions'
import { redirect } from "next/navigation";
import { getGuild, getSession } from "@/app/actions/getInfo";

// Общий тип для API ответов с ошибкой
interface ApiErrorResponse {
    message?: string;
}

// Утилита для обработки API ответов
async function handleApiResponse(response: Response) {
    if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        console.log(errorData);

        throw new Error(errorData.message
            ? `${errorData.message} (err ${response.status})`
            : `Неизвестная ошибка (err ${response.status})`);
    }
    return response.json();
}

// Утилита для авторизованных запросов
async function makeAuthorizedRequest(url: string, token: string, data: object, method = 'GET') {
    return fetch(url, {
        method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

export async function guild_application(state: GuildApplicationFormState, formData: FormData) {
    try {
        // Валидация полей
        const validatedFields = GuildApplicationFormSchema.safeParse(Object.fromEntries(formData));
        if (!validatedFields.success) {
            return { errors: validatedFields.error.flatten().fieldErrors };
        }

        const { about_user, why_this_guild, guildUrl } = validatedFields.data;

        // Получение сессии и гильдии
        const user_response = await getSession();
        if (!user_response.success) throw new Error('Не удалось получить вашу сессию (err auth)');

        const guild_response = await getGuild(guildUrl);
        if (!guild_response.success) throw new Error('Не удалось получить гильдию (err guild)');

        // Отправка заявки
        let response = await makeAuthorizedRequest(
            `/api/v1/guilds/${guildUrl}/applications`,
            user_response.data.token,
            { about_user, why_this_guild },
            "PUT"
        );
        await handleApiResponse(response);

        // Отправка уведомления
        response = await makeAuthorizedRequest(
            `/api/v1/notifications`,
            user_response.data.token,
            {
                userId: user_response.data.profile.id,
                message: "Ваша заявка в гильдию получена! Мы уведомим вас, как только она будет рассмотрена главой гильдии."
            },
            "POST"
        );
        await handleApiResponse(response);
    } catch (error) {
        return {message: error instanceof Error ? error.message : 'Произошла ошибка'};
    }
    redirect("/me/guilds");
}

export async function signup(state: FormState, formData: FormData) {
    try {
        // Валидация полей
        const validatedFields = SignupFormSchema.safeParse(Object.fromEntries(formData));
        if (!validatedFields.success) {
            return { errors: validatedFields.error.flatten().fieldErrors };
        }

        const { username, password } = validatedFields.data;

        // Логин
        const loginResponse = await fetch('/api/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        });

        const { data: { uuid, ip } } = await handleApiResponse(loginResponse);

        // Создание сессии
        const sessionResponse = await fetch('/api/v1/auth/create-session', {
            method: 'POST',
            body: JSON.stringify({ uuid, username }),
            headers: { 'Content-Type': 'application/json' }
        });

        const { token } = await handleApiResponse(sessionResponse);

        // Отправка уведомления
        const response = await makeAuthorizedRequest(
            `/api/v1/notifications`,
            token,
            {
                nickname: username,
                message: `Вы авторизовались под IP ${ip}`
            },
            "POST"
        );
        await handleApiResponse(response);

        return { success: true }; // Успех без редиректа, обработка на клиенте
    } catch (error) {
        return { message: error instanceof Error ? error.message : 'Произошла ошибка' };
    }
}

export async function verify_application(state: VerifyApplicationFormState, formData: FormData) {
    try {
        // Валидация полей
        const validatedFields = VerifyApplicationFormSchema.safeParse(Object.fromEntries(formData));
        if (!validatedFields.success) {
            return { errors: validatedFields.error.flatten().fieldErrors };
        }

        const { nickname, age, about, where_find, plans } = validatedFields.data;

        // Проверка сессии
        const user_response = await getSession();
        if (!user_response.success) throw new Error('Не удалось получить вашу сессию (err auth)');

        const { data: userData } = user_response;
        if (userData.profile.hasAccess) redirect('/me');

        // Отправка заявки
        let response = await makeAuthorizedRequest(
            `/api/v1/users/applications`,
            user_response.data.token,
            { nickname, age, about, where_find, plans },
            "PUT",
        );
        await handleApiResponse(response);

        // Отправка уведомления
        response = await makeAuthorizedRequest(
            `/api/v1/notifications`,
            user_response.data.token,
            { userId: userData.profile.id, message: "Ваша заявка получена! Мы уведомим вас, как только она будет рассмотрена." },
            "POST"
        );
        await handleApiResponse(response);

        // Отправка в Discord
        const discordPayload = {
            content: "",
            tts: false,
            embeds: [{
                id: 467674012,
                color: 15510603,
                description: `## Заявка игрока ${nickname}\n` +
                    `Возраст: ${age}\n` +
                    `О игроке: ${about}\n` +
                    `Откуда узнал о проекте: ${where_find}\n` +
                    `Планы: ${plans}\n\n` +
                    `[Рассмотреть заявку](https://foxworld.ru/admin/applications)`,
            }],
            username: "Заявки",
            avatar_url: "https://cdn.discordapp.com/avatars/948287446808932373/73fbe4737f059852f8ffc523d83927e0.png"
        };

        await fetch(
            "https://discord.com/api/webhooks/1346083291325009951/zWw4VjgNVMu7DTN7AYLUCXGe3tBKNYIVsFccPx8NgQDCyVrIQt486WgS_9CIQgVULBnJ",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(discordPayload),
            }
        );

    } catch (error) {
        console.log(error)
        return { message: error instanceof Error ? error.message : 'Произошла ошибка' };
    }
    redirect('/me');
}