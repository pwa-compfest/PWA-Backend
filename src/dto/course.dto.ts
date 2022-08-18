import z from 'zod';

export const getAllCourseSchema = z.object({
  page: z.number(),
  limit: z.number()
})

export const getCourseByInstructorSchema = z.object({
  instructorId: z.number(),
  page: z.number(),
  limit: z.number()
})

export const getCourseByStudentSchema = z.object({
  studentId: z.number(),
  page: z.number(),
  limit: z.number()
})

export const deleteCourseSchema = z.object({
  courseId: z.number(),
})

export const getBySearchSchema = z.object({
  search: z.string(),
  page: z.number(),
  limit: z.number()
})

export const idSchema = z.object({
  courseId: z.number(),
})

export const enrollCourseSchema = z.object({
  courseId: z.number(),
  studentId: z.number(),
})

export const courseSchema = z
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
