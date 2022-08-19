import { InstructorService } from '@/services/index'
import { Request, Response } from 'express'
import { getResponse, getHttpCode, } from '@/utils'

const instructorService = new InstructorService()

export const rejectInstructor = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    const result = await instructorService.isVerify({instructorId: +id, is_verified: 0})
    if (result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, result.data, null)
    } else {
        return getResponse(res, getHttpCode.OK, 'Success Reject Instructor', result.data.data);
    }
}