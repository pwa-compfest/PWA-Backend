import { CourseService } from '@/services/index'
import { Request, Response } from 'express'
import { getResponse, getHttpCode, } from '@/utils'

const courseService = new CourseService()

export const verifyCourse = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    const result = await courseService.isVerify({courseId: +id, is_verified: 1})
    if (result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
    } else {
        return getResponse(res, getHttpCode.OK, 'Success Verify Course', result.data);
    }
}

export const rejectCourse = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    const result = await courseService.isVerify({courseId: +id, is_verified: 0})
    if (result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
    } else {
        return getResponse(res, getHttpCode.OK, 'Success Reject Course', result.data);
    }
}