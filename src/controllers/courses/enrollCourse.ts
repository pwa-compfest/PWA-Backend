import { CourseService } from '@/services/index'
import { Request, Response } from 'express'
import { getResponse, getHttpCode } from '@/utils'

const courseService = new CourseService()

export const enrollCourse = async (req: Request, res: Response) => {
    const course_id = parseInt(req.params.id)
    const studentId = parseInt(req.user.studentId)

    const checkEnroll = await courseService.checkEnroll({course_id: +course_id, student_id: +studentId})
    if(checkEnroll.status === 'success'){
        return getResponse(res, getHttpCode.BAD_REQUEST, 'Already Enroll Course', null)
    }

    const result = await courseService.enrollCourse({course_id: +course_id, student_id: +studentId})
    if(result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
    }else{
        return getResponse(res, getHttpCode.OK, 'Success Enroll Course', result.data);
    }
}
