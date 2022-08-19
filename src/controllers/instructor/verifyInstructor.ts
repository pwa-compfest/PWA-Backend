import { InstructorService } from '@/services/index'
import { Request, Response } from 'express'
import { getResponse, getHttpCode, } from '@/utils'

const instructorService = new InstructorService()

export const verifyInstructor = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    console.log(id)
    const result = await instructorService.isVerify({instructorId: +id, is_verified: 1})
    if (result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, result.data, null);
    } else {
        return getResponse(res, getHttpCode.OK, 'Success Verify Instructor', {});
    }
}