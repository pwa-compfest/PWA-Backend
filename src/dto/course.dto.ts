import z from 'zod';

export const CourseSchema = z
    .object({
        name: z.string().min(3, { message: 'Course name at least 3 characters' }),
        description: z.string().min(3, { message: 'Course description at least 3 characters' }),
        image: z.string().min(3, { message: 'Course image at least 3 characters' }),
        is_verified: z.boolean(),
    })
