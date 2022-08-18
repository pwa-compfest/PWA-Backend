import { CourseService, InstructorService, StudentService } from '@/services/index'
import { Request, Response } from 'express'
import { getResponse,getHttpCode,downloadObject} from '@/utils'

const courseService = new CourseService()
const instructorService = new InstructorService()
const studentService = new StudentService()

export const getVerifiedCourses = async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
    const search = req.query.search ? req.query.search as string : ''
    let result = await courseService.getAllCourses({page: +page, limit: +limit})
    let total = await courseService.count(limit)
    if (search) {
        result = await courseService.getBySearch({search: search, page: +page, limit: +limit})
        total = await courseService.countBySearch(search, limit)
    }
    if (result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, 'Failed Get Courses', total)
    }
    return getResponse(res, getHttpCode.OK, 'Success Get Courses', result.data, total)
}

export const getUnverifiedCourse = async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
    let result = await courseService.getUnverifiedCourse({page: +page, limit: +limit})
    if (result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, 'Failed Get Courses', null)
    }
    return getResponse(res, getHttpCode.OK, 'Success Get Courses', result.data)
}

export const getCoursesByInstructor = async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
    const userId = parseInt(req.user.id)

    const instructorId = await instructorService.getInstructorId(userId)

    let result = await courseService.getCourseByInstructor({instructorId: +instructorId.data.id, page: +page, limit: +limit})
    let total = await courseService.countByInstructor(instructorId.data.id,limit)
    if (result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, 'Failed Get Courses', total)
    }

    return getResponse(res, getHttpCode.OK, 'Success Get Courses', result.data, total)
}

// export const getCourseByStudent = async (req: Request, res: Response) => {
//     const page = req.query.page ? parseInt(req.query.page as string) : 1
//     const userId = await studentService.getStudentId(parseInt(req.user.id))
//     const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
//     const instructorId = await instructorService.getInstructorId(userId)
//     let result = await courseService.getCourseByStudent(instructorId.data.id, page, limit)
//     let total = await courseService.countByStudent(instructorId.data.id,limit)
//     if (result.status === 'failed') {
//         return getResponse(res, getHttpCode.BAD_REQUEST, 'Failed Get Courses', total)
//     }
// }

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
