import { CourseService } from '@/services/index'
import { Request, Response } from 'express'
import { getResponse, getHttpCode } from '@/utils'

const courseService = new CourseService()

export const publicCourse = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)

    const checkCourse = await courseService.getCourseById(id)

    if (checkCourse.data.instructor_id !== parseInt(req.user.instructorId)) {
        return getResponse(res, getHttpCode.BAD_REQUEST, 'You are not authorized to publish this course', {})
    }

    const result = await courseService.isPublic({ courseId: +id, setPublic: true })
    if (result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, 'Failed Publish Course', null);
    } else {
        return getResponse(res, getHttpCode.OK, 'Success Publish Course', null);
    }
}

export const privateCourse = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)

    const checkCourse = await courseService.getCourseById(id)
    if (checkCourse.data.instructor_id !== parseInt(req.user.instructorId)) {
        return getResponse(res, getHttpCode.BAD_REQUEST, 'You are not authorized to private this course', {})
    }

    const result = await courseService.isPublic({ courseId: +id, setPublic: false })
    if (result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, 'Failed Hide', null);
    } else {
        return getResponse(res, getHttpCode.OK, 'Success Hide Course', null);
    }
}