import {
    SignupFormSchema,
    FormState,
    GuildApplicationFormSchema,
    GuildApplicationFormState,
    VerifyApplicationFormState, VerifyApplicationFormSchema
} from '@/lib/definitions'
import {redirect} from "next/navigation";
import {getGuild, getSession} from "@/app/actions/getInfo";

export async function guild_application(state: GuildApplicationFormState, formData: FormData) {
    // Валидация полей авторизации
    const validatedFields = GuildApplicationFormSchema.safeParse({
        about_user: formData.get('about_user'),
        why_this_guild: formData.get('why_this_guild'),
        guildUrl: formData.get('guildUrl'),
    })

    // Если найдена ошибка, возвращаем ответ с ошибкой
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const {about_user, why_this_guild, guildUrl} = validatedFields.data
    const user_response = await getSession()
    if (!user_response.success) {
        return {
            message: 'Не удалось получить вашу сессию (err auth)',
        }
    }

    const guild_response = await getGuild(guildUrl)
    if (!guild_response.success) {
        return {
            message: 'Не удалось получить гильдию (err guild)',
        }
    }

    const session_token = user_response.data.token;
    const response = await fetch(`/api/v1/guilds/${guildUrl}/applications`, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${session_token}`,
        },
        body: JSON.stringify({ about_user, why_this_guild }),
    })
    if ( !response.ok ){
        const errorData = await response.json()
        console.error(errorData)

        return {
            message: errorData.message ? `${errorData.message} (err ${response.status})` : `Неизвестная ошибка (err ${response.status})`,
        }
    }

    redirect('/me/guilds')
}

export async function signup(state: FormState, formData: FormData) {
    // Валидация полей авторизации
    const validatedFields = SignupFormSchema.safeParse({
        username: formData.get('username'),
        password: formData.get('password'),
    })

    // Если найдена ошибка, возвращаем ответ с ошибкой
    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { username, password } = validatedFields.data

    const result = await fetch('/api/v1/auth/login',{
        method: 'POST',
        body: JSON.stringify({ username, password })
    })

    if ( !result.ok ){
        const errorData = await result.json()
        console.error(errorData)

        return {
            message: errorData.message ? `${errorData.message} (err ${result.status})` : `Неизвестная ошибка (err ${result.status})`,
        }
    }

    const json : any = await result.json()
    const uuid = json.data.uuid

    const response = await fetch('/api/v1/auth/create-session',{
        method: 'POST',
        body: JSON.stringify({ uuid, username })
    })
    if (!response.ok){
        const errorData = await response.json()
        console.error(errorData)

        return {
            message: errorData.message ? `${errorData.message} (err ${response.status})` : `Неизвестная ошибка (err ${response.status})`,
        }
    }
    redirect("/me")
}

export async function verify_application(state: VerifyApplicationFormState, formData: FormData) {
    // Валидация полей авторизации
    const validatedFields = VerifyApplicationFormSchema.safeParse({
        nickname: formData.get('nickname'),
        age: formData.get('age'),
        about: formData.get('about'),
        where_find: formData.get('where_find'),
        plans: formData.get('plans'),
    })

    // Если найдена ошибка, возвращаем ответ с ошибкой
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const {nickname, age, about, where_find, plans} = validatedFields.data
    const user_response = await getSession()
    if (!user_response.success) {
        return {
            message: 'Не удалось получить вашу сессию (err auth)',
        }
    }

    const userData = user_response.data
    if ( userData.profile.has_access ){
        redirect('/me')
    }

    const session_token = user_response.data.token;
    const response = await fetch(`/api/v1/users/applications`, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${session_token}`,
        },
        body: JSON.stringify({ nickname, age, about, where_find, plans }),
    })

    if ( !response.ok ){
        const errorData = await response.json()
        console.error(errorData)

        return {
            message: errorData.message ? `${errorData.message} (err ${response.status})` : `Неизвестная ошибка (err ${response.status})`,
        }
    }

    const body = {
      "content": "",
      "tts": false,
      "embeds": [
        {
          "id": 467674012,
          "color": 15510603,
          "fields": [],
          "description": `## Заявка игрока ${nickname}\nВозраст: ${age}\nО игроке: ${about}\nОткуда узнал о проекте: ${where_find}\nПланы: ${plans}\n\n[Рассмотреть заявку](https://foxworld.ru/admin/applications)`
        }
      ],
      "components": [],
      "actions": {},
      "username": "Заявки",
      "avatar_url": "https://cdn.discordapp.com/avatars/948287446808932373/73fbe4737f059852f8ffc523d83927e0.png"
    }

    const res = await fetch("https://discord.com/api/webhooks/1346083291325009951/zWw4VjgNVMu7DTN7AYLUCXGe3tBKNYIVsFccPx8NgQDCyVrIQt486WgS_9CIQgVULBnJ",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })

    if ( !res.ok ){
        const errorData = await res.json()
        console.error(errorData)
        return {
            message: 'Не удалось отправить сообщение о вашей заявке (err ' + res.status + ')',
        }
    }

    redirect('/me')
}