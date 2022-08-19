import {z} from 'zod'

export const verifyInstructorSchema = z.object({
    id: z.number(),
    is_verified: z.number()
})