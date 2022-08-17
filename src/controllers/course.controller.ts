import { CourseService, StudentProgressService, StudentService, InstructorService } from '@/services/index'
import { Request, Response } from 'express'
import { getResponse, getHttpCode, downloadObject, uploadFile, deleteObject } from '@/utils'
import fs from 'fs'

const courseService = new CourseService()
const studentProgressService = new StudentProgressService()
const studentService = new StudentService()
const instructorService = new InstructorService()

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


export const getImage = async (req: Request, res: Response) => {
  const bucket = 'perwibuan-mooc/courses'
  const { file } = req.params
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


export const verifyCourse = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  const result = await courseService.verifyCourse(id)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
  } else {
    return getResponse(res, getHttpCode.OK, 'Success Verify Course', result.data);
  }
}

export const rejectCourse = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  const result = await courseService.rejectCourse(id)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
  } else {
    return getResponse(res, getHttpCode.OK, 'Success Reject Course', result.data);
  }
}

export const store = async (req: Request, res: Response) => {
  const user_id = parseInt(req.user.id)
  const instructorId = await instructorService.getInstructorId(user_id)

  if(!instructorId){
    return getResponse(res, getHttpCode.BAD_REQUEST, 'Failed Store Course', {});
  }

  const file = req.file
  const bucket = 'perwibuan-mooc/courses'

  if (!file) {
    return getResponse(res, getHttpCode.BAD_REQUEST, 'Image is required', null)
  }

  const payload = {
    instructor_id: instructorId.id,
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

export const update = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  const instructorId = await instructorService.getInstructorId(req.user.id)

  if(!instructorId){
    return getResponse(res, getHttpCode.BAD_REQUEST, 'Failed Store Course', {});
  }

  const file = req.file
  const bucket = 'perwibuan-mooc/courses'
  const data = await courseService.getCourseById(id)
  let image = file != null ? file.filename : data.data.image

  if(instructorId.id != data.data.instructor_id){
    return getResponse(res, getHttpCode.BAD_REQUEST, 'Not Allowed Update Course', {});
  }

  const payload = {
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
    return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
  } else {
    return getResponse(res, getHttpCode.OK, 'Success Edit Course', result.data);
  }
}

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

export const enrollCourse = async (req: Request, res: Response) => {
    const course_id = parseInt(req.params.id)
    const user_id = parseInt(req.user.id)

    const student_id = await studentService.getStudentId(user_id)

    if(!student_id){
        return getResponse(res, getHttpCode.BAD_REQUEST, 'Student Not Found', null)
    }

    const result = await studentProgressService.enrollCourse(course_id,student_id.id)
    if(result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
    }else{
        return getResponse(res, getHttpCode.OK, 'Success Enroll Course', result.data);
    }
}

export const publicCourse = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    const result = await courseService.setPublicCourse(id)
    if (result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
    } else {
        return getResponse(res, getHttpCode.OK, 'Success Publish Course', result.data);
    }
}

export const privateCourse = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    const result = await courseService.setPrivateCourse(id)
    if (result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
    } else {
        return getResponse(res, getHttpCode.OK, 'Success Publish Course', result.data);
    }
}
