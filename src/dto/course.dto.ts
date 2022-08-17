import z from 'zod';

export const CourseSchema = z
  .object({
    title: z.string().min(3, { message: 'Course name at least 3 characters' }),
    description: z.string().min(3, { message: 'Course description at least 3 characters' }),
    image: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (!data.title) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Course name is required'
      })
    }
    if (!data.description) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Course description is required'
      })
    }
    if (!data.image) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Course image is required'
      })
    }
  })
