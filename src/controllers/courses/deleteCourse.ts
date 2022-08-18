import { CourseService } from '@/services/index'
import { Request, Response } from 'express'
import { getResponse, getHttpCode, deleteObject } from '@/utils'


const courseService = new CourseService()

export const destroy = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    const getCourse = await courseService.getCourseById(id)
    if (getCourse.status === 'failed') {
      return getResponse(res, getHttpCode.BAD_REQUEST, getCourse.data, {});
    } else {
      const bucket = 'perwibuan-mooc/courses'
      deleteObject(bucket, getCourse.data.image)
      const result = await courseService.deleteCourse(id)
      if (result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
      } else {
        return getResponse(res, getHttpCode.OK, 'Success Delete Course', result.data);
      }
    }
}