import { CourseService } from '@/services/index'
import { Request, Response } from 'express'
import { getResponse, getHttpCode, uploadFile } from '@/utils'
import fs from 'fs'

const courseService = new CourseService()

export const store = async (req: Request, res: Response) => {
  const instructorId = parseInt(req.user.instructorId)

  const file = req.file
  const bucket = 'perwibuan-mooc/courses'

  if (!file) {
    return getResponse(res, getHttpCode.BAD_REQUEST, 'Image is required', null)
  }

  const payload = {
    instructor_id: instructorId,
    title: req.body.title,
    description: req.body.description,
    image: file.filename
  }

  const result = await courseService.createCourse(payload)
  if (result.status === 'failed') {
    fs.unlinkSync(file.path)
    return getResponse(res, getHttpCode.BAD_REQUEST, result.data, null);
  }
  uploadFile(file, bucket)
  return getResponse(res, getHttpCode.OK, "Your Request Has Been Sent", result.data);

}
