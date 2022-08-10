import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, { message: 'Password at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Confirm Password at least 8 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwod and confirm password must be same',
  });
