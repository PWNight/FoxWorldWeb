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

export type FormState =
  | {
      errors?: {
        username?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined