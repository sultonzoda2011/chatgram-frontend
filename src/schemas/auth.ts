import { z } from 'zod'

export const LoginSchema = z.object({
  username: z.string().min(1, 'Имя пользователя обязательно').min(3, 'Минимум 3 символа'),
  password: z.string().min(1, 'Пароль обязателен').min(6, 'Минимум 6 символов'),
})

export const RegisterSchema = z.object({
  username: z.string().min(1, 'Имя пользователя обязательно').min(3, 'Минимум 3 символа'),
  fullname: z.string().min(1, 'Полное имя обязательно').min(3, 'Минимум 3 символа'),
  email: z.string().min(1, 'Email обязателен').email('Неверный email'),
  password: z.string().min(1, 'Пароль обязателен').min(6, 'Минимум 6 символов'),
})


export const UpdateProfileSchema = z.object({
  username: z.string().min(1, 'Имя пользователя обязательно').min(3, 'Минимум 3 символа'),
  fullname: z.string().min(1, 'Полное имя обязательно').min(3, 'Минимум 3 символа'),
  email: z.string().min(1, 'Email обязателен').email('Неверный email'),
})

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Старый пароль обязателен').min(6, 'Минимум 6 символов'),
  newPassword: z.string().min(1, 'Новый пароль обязателен').min(6, 'Минимум 6 символов'),
  confirmPassword: z
    .string()
    .min(1, 'Подтверждение пароля обязательно')
    .min(6, 'Минимум 6 символов'),
})
