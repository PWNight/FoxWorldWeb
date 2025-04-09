import {
    SignupFormSchema,
    FormState,
    GuildApplicationFormSchema,
    GuildApplicationFormState,
} from '@/lib/definitions'
import { redirect } from "next/navigation";
import { getGuild, getSession } from "@/app/actions/getDataHandlers";

// Общий тип для API ответов с ошибкой
interface ApiErrorResponse {
    message?: string;
}

// Утилита для отправки уведомлений пользователем
export async function sendNotification(uId: number, token: string, message: string){
    const response = await fetch("/api/v1/notifications", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
            userId: uId,
            message,
        }),
    });
    if ( !response.ok ) {
        const errorJSON = await response.json();
        console.log(errorJSON)

        return {
            success: false,
            code: response.status,
            message: errorJSON.message || "Произошла ошибка при отправке уведомления",
            error: errorJSON.error || "Неизвестная ошибка",
        }
    }

    return { success: true }
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
        if (!user_response.success) return {message: 'Не удалось получить вашу сессию (err auth)'};

        const guild_response = await getGuild(guildUrl);
        if (!guild_response.success) return {message: 'Не удалось получить гильдию (err guild)'};

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
        const redirectTo = formData.get("redirectTo")?.toString() || "/me"; // Получаем redirectTo из формы

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
                message: `Вы авторизовались под IP${ip}`
            },
            "POST"
        );
        await handleApiResponse(response);

        // Возвращаем успех и redirectTo
        return { success: true, redirectTo };
    } catch (error) {
        return { message: error instanceof Error ? error.message : 'Произошла ошибка' };
    }
}