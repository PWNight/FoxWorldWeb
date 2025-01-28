import { SignupFormSchema, FormState } from '@/lib/definitions'
import {redirect} from "next/navigation";
import {createSession, encrypt} from "@/lib/session";

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