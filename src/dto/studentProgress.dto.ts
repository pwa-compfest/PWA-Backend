import z from 'zod';

export const StudentProgressSchema = z
    .object({
        course_id: z.number().positive(),
        student_id: z.number().positive(),
    }).superRefine((data, ctx) => {
        if (!data.course_id) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Course id is required'
            })
        }
        if (!data.student_id) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Student id is required'
            })
        }
    })
