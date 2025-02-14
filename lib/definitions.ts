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