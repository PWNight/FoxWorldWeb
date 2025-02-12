import {SignupFormSchema, FormState, GuildApplicationFormSchema, GuildApplicationFormState} from '@/lib/definitions'
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
            message: 'Не удалось отправить заявку (err ' + 'auth' + ')',
        }
    }
    const userData = user_response.data;

    const guild_response = await getGuild(guildUrl)
    if (!guild_response.success) {
        return {
            message: 'Не удалось отправить заявку (err ' + 'invalid guild' + ')',
        }
    }

    const response = await fetch(`/api/v1/guilds/${guildUrl}/applications`, {
        body: JSON.stringify({'user_id': userData.profile.id, guild_url: guildUrl, about_user, why_this_guild}),
    })
    if ( !response.ok ){
        return {
            message: 'Не удалось отправить заявку (err ' + response.status + ')',
        }
    }
    const json = await response.json()
    if ( !json.success ){
        return {
            message: 'Не удалось отправить заявку (err ' + response.status + ')',
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

    if(result.ok){
        const json : any = await result.json()
        const uuid = json.data.uuid

        const response = await fetch('/api/v1/auth/create-session',{
            method: 'POST',
            body: JSON.stringify({ uuid, username })
        })
        if (!response.ok){
            return {
              message: 'Не удалось войти (err ' + response.status + ')',
            }
        }
        redirect("/me")
    }else{
        return {
          message: 'Не удалось войти (err ' + result.status + ')',
        }
    }
}