import { CourseService } from '@/services/index'
import { Request, Response } from 'express'
import { getResponse,getHttpCode,downloadObject} from '@/utils'

const courseService = new CourseService()

export const getVerifiedCourses = async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
    const search = req.query.search ? req.query.search as string : ''
    let result = await courseService.getAllVerifiedCourses(page, limit)
    let total = await courseService.count(limit)
    if (search) {
        result = await courseService.getBySearch(search, page, limit)
        total = await courseService.countBySearch(search, limit)
    }
    if (result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, 'Failed Get Courses', total)
    }
    return getResponse(res, getHttpCode.OK, 'Success Get Courses', result.data, total)
}

export const getCourses = async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
    let result = await courseService.getAllCourses(page, limit)
    let total = await courseService.count(limit)
    if (result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, 'Failed Get Courses', total)
    }
    return getResponse(res, getHttpCode.OK, 'Success Get Courses', result.data, total)
}

export const getCoursesByInstructor = async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
    const instructorId = req.query.instructorId ? parseInt(req.query.instructorId as string) : 0
    let result = await courseService.getCourseByInstructor(instructorId, page, limit)
    let total = await courseService.count(limit)
    if (result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, 'Failed Get Courses', total)
    }
    return getResponse(res, getHttpCode.OK, 'Success Get Courses', result.data, total)
}

export const getImage = async (req: Request, res: Response) => {
    const bucket = 'perwibuan-mooc/courses'
    const {file} = req.params
    const readStream = downloadObject(file, bucket)
    readStream.pipe(res)
}

export const getCourseById = async (req: Request, res: Response,) => {
    const id = parseInt(req.params.id)
    const result = await courseService.getCourseById(id)
    if (result.status === 'failed') {
      return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
    } else {
      return getResponse(res, getHttpCode.OK, 'Success Get Course', result.data);
    }
}