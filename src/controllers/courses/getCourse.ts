import { CourseService } from '@/services/index'
import { Request, Response } from 'express'
import { getResponse, getHttpCode } from '@/utils'

const courseService = new CourseService()

export const getVerifiedCourses = async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
  const search = req.query.search ? req.query.search as string : ''
  let result = await courseService.getAllCourses({ page: +page, limit: +limit })
  let total = await courseService.count(limit)
  if (search) {
    result = await courseService.getBySearch({ search: search, page: +page, limit: +limit })
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
  let result = await courseService.getUnverifiedCourse({ page: +page, limit: +limit })
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.BAD_REQUEST, 'Failed Get Courses', null)
  }
  return getResponse(res, getHttpCode.OK, 'Success Get Courses', result.data)
}

export const getCoursesByInstructor = async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
  const instructorId = parseInt(req.user.instructorId)
  let result = await courseService.getCourseByInstructor({ instructorId: +instructorId, page: +page, limit: +limit })
  let total = await courseService.countByInstructor(instructorId, limit)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.BAD_REQUEST, 'Failed Get Courses', total)
  }

  return getResponse(res, getHttpCode.OK, 'Success Get Courses', result.data, total)
}

export const getDetailCourseByInstructor = async (req: Request, res: Response,) => {
    const id = parseInt(req.params.id)
    const instructorId = parseInt(req.user.instructorId)
    const result = await courseService.getDetailCourseByInstructor(id,instructorId)
    if (result.status === 'failed') {
      return getResponse(res, getHttpCode.BAD_REQUEST, 'Failed Get Courses', {});
    } else {
      return getResponse(res, getHttpCode.OK, 'Success Get Course', result.data);
    }
}

export const getCourseByStudent = async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1
  const studentId = parseInt(req.user.studentId)
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
  let result = await courseService.getCourseByStudent({ studentId: +studentId, page: +page, limit: +limit })
  let total = await courseService.countByStudent(studentId, limit)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.BAD_REQUEST, 'Failed Get Courses', total)
  } else {
    return getResponse(res, getHttpCode.OK, 'Success Get Course', result.data);
  }
}

export const getDetailCourseByStudent = async (req: Request, res: Response) => {
  const studentId = parseInt(req.user.studentId)
  const courseId = parseInt(req.params.id)
  let result = await courseService.getDetailCourseByStudent({ studentId: +studentId, courseId: +courseId})
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.BAD_REQUEST, 'Failed Get Courses', null)
  } else {
    return getResponse(res, getHttpCode.OK, 'Success Get Course', result.data);
  }
}
