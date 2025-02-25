import { z } from 'zod'

export const SignupFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Минимальная длина никнейма - 3 символа' })
    .trim(),
  password: z
    .string()
    .min(8, { message: 'Минимальная длина пароля - 8 символов' })
    .trim(),
})

export const GuildApplicationFormSchema = z.object({
  about_user: z
    .string()
    .min(8, { message: 'Минимальная длина значения - 8 символов' })
    .trim(),
  why_this_guild: z
    .string()
    .min(8, { message: 'Минимальная длина значения - 8 символов' })
    .trim(),
  guildUrl: z
    .string()
    .trim()
})

export const VerifyApplicationFormSchema = z.object({
  nickname: z
    .string()
    .trim(),
  age: z.preprocess((val) => {
    if (typeof val === 'string') {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? val : parsed;
    }
    return val;
  }, z.number({
    invalid_type_error: 'Это поле должно быть числом',
    required_error: 'Это поле обязательно для заполнения',
  }).int('Возраст должен быть целым числом').positive('Возраст должен быть положительным числом')),
  about: z
    .string()
    .min(1, {message: "Это поле обязательно к заполнению"})
    .trim(),
  where_find: z
    .string()
    .min(1, {message: "Это поле обязательно к заполнению"})
    .trim(),
  plans: z
    .string()
    .min(1, {message: "Это поле обязательно к заполнению"})
    .trim(),
})

export type FormState =
  | {
      errors?: {
        username?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export type GuildApplicationFormState =
  | {
      errors?: {
        about_user?: string[]
        why_this_guild?: string[]
        guildUrl?: string[]
      }
      message?: string
    }
  | undefined
export type VerifyApplicationFormState =
  | {
      errors?: {
        nickname?: string[]
        age?: string[]
        about?: string[]
        where_find?: string[]
        plans?: string[]
      }
      message?: string
    }
  | undefined