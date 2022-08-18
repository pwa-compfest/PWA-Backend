import z from 'zod'

export const getStudentIdSchema = z.object({
    userId: z.number()
})