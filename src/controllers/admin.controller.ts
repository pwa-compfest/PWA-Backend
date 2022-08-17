import { CourseService } from '@/services/course.service'
import { Request, Response } from 'express'
import { getResponse, getHttpCode} from '@/utils'

const courseService = new CourseService()

export const getCourses = async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
    let result = await courseService.getAllCourses(page, limit)
    let total = await courseService.count(limit)
    if(result.status === 'failed'){
        return getResponse(res, getHttpCode.BAD_REQUEST,'Failed Get Courses', total)
    }
    return getResponse(res, getHttpCode.OK,'Success Get Courses',result.data, total)
}

export const verifyCourse = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    const result = await courseService.verifyCourse(id)
    if(result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
    }else{
        return getResponse(res, getHttpCode.OK, 'Success Verify Course', result.data);
    }
}

export const rejectCourse = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    const result = await courseService.rejectCourse(id)
    if(result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
    }else{
        return getResponse(res, getHttpCode.OK, 'Success Reject Course', result.data);
    }
}
