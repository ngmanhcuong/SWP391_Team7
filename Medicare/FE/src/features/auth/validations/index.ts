import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Email không hợp lệ').min(1, 'Email là bắt buộc'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Họ tên ít nhất 2 ký tự').max(50),
    email: z.string().trim().email('Email không hợp lệ'),
    phone: z.string().trim().regex(/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ'),
    password: z
      .string()
      .min(8, 'Mật khẩu ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
      .regex(/[0-9]/, 'Phải có ít nhất 1 số'),
    confirmPassword: z.string(),
    agreeTerms: z.boolean().refine((value) => value === true, 'Bạn phải đồng ý với điều khoản'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Email không hợp lệ'),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Mật khẩu ít nhất 8 ký tự'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
