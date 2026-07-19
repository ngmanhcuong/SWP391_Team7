import { z } from 'zod';

export const profileSchema = z.object({
  fullName: z.string().trim().min(1, 'Họ tên không được để trống'),
  phone: z
    .string()
    .trim()
    .min(1, 'Số điện thoại là bắt buộc')
    .regex(/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ'),
  dateOfBirth: z.string().trim().min(1, 'Ngày tháng năm sinh là bắt buộc'),
  gender: z.string().optional(),
  nationalId: z.string().trim().min(1, 'Mã bảo hiểm là bắt buộc'),
  emergencyPhone: z.string().optional(),
  occupation: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  height: z
    .string()
    .trim()
    .min(1, 'Chiều cao là bắt buộc')
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, 'Chiều cao phải lớn hơn 0'),
  weight: z.string().optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
