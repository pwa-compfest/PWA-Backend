import z from 'zod'

export const getInstructorIdSchema = z.object({
    userId: z.number()
})