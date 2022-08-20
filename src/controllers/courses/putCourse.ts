import { CourseService, InstructorService } from '@/services/index'
import { Request, Response } from 'express'
import { getResponse, getHttpCode, uploadFile, deleteObject } from '@/utils'
import fs from 'fs'

const courseService = new CourseService()
const instructorService = new InstructorService()

export const update = async (req: Request, res: Response) => {

    const id = parseInt(req.params.id)
    const instructorId = parseInt(req.user.instructorId)

    const file = req.file

    const bucket = 'perwibuan-mooc/courses'
    const data = await courseService.getCourseById(id)
    let image = file != null ? file?.filename : data.data.image

    if(instructorId != data.data.instructor_id){
      fs.unlinkSync(file.path)
      return getResponse(res, getHttpCode.BAD_REQUEST, 'Not Allowed Update Course', {});
    }

    const payload = {
      instructor_id: instructorId,
      title: req.body.title,
      description: req.body.description,
      image: image
    }
    const result = await courseService.updateCourse(id, payload)

    if (file != null) {
      deleteObject(bucket, data.data.image)
      uploadFile(file, bucket)
    }

    if (result.status === 'failed') {
      fs.unlinkSync(file.path)
      return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
    } else {
      return getResponse(res, getHttpCode.OK, 'Success Edit Course', result.data);
    }
  }
