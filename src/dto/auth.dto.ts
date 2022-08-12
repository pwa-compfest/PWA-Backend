import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, { message: 'Password at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Confirm Password at least 8 characters' }),
    data: z.object({
      role: z.enum(["ADMIN", "INSTRUCTOR", "STUDENT"]),
      nisn: z.string().optional(),
      name: z.string().optional(),
      grade: z.string().optional(),
      majority: z.string().optional(),
      nip: z.string().optional(),
      gender: z.string().optional(),
      expertise: z.string().optional(),
      phoneNumber: z.string().nullable().optional(),
      photo: z.string().nullable().optional(),
    })
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwod and confirm password must be same',
      })
    }

    if (data.data.role === 'INSTRUCTOR') {
      if (!data.data.nip) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'NIP is required'
        })
      }

      if (!data.data.expertise) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Expertise is required'
        })
      }
      if (!data.data.phoneNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Phone number is required'
        })
      }
    }

    if (data.data.role === 'STUDENT') {
      if (!data.data.nisn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'NISN is required'
        })
      }
      if (!data.data.grade) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Grade is required'
        })
      }
      if (!data.data.majority) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Majority is required'
        })
      }
    }

    if (data.data.role !== 'ADMIN') {
      if (!data.data.name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Name is required'
        })
      }
      if (!data.data.gender) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Gender is required'
        })
      }
    }
  });