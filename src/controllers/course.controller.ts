import { CourseService } from '@/services/course.service'
import { Request, Response } from 'express'
import { getResponse, getHttpCode,downloadObject, uploadFile, deleteObject} from '@/utils'

const courseService = new CourseService()

export const get = async (req: Request, res: Response) => {
    const data = await courseService.getAllCourses()
    return getResponse(res, getHttpCode.OK, 'Berhasil Mendapatkan Data Course',data)
}

export const getImage = async (req: Request, res: Response) => {
    const bucket = 'perwibuan-mooc/courses'
    const {file} = req.params
    const readStream = downloadObject(file,bucket)
    readStream.pipe(res)
}

export const store = async (req: Request, res: Response) => {
        const file = req.file
        const bucket = 'perwibuan-mooc/courses'
        if(!file) {
            return getResponse(res, getHttpCode.BAD_REQUEST, 'Image has required',null)
        }
        const payload = {
            instructor_id: req.body.instructor_id,
            title: req.body.title,
            description: req.body.description,
            image: file.filename
        }
        const result = await courseService.createCourse(payload)
        uploadFile(file,bucket)
        if (result.status === 'failed') {
            return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
        }
        return getResponse(res, getHttpCode.OK, 'Success', result.data);
}

export const update = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    const file = req.file
    const bucket = 'perwibuan-mooc/courses'
    const data = await courseService.getCourseById(id)
    let image = data.data.image
    if(file != null){
        image = file.filename
        deleteObject(bucket,data.data.image)
        uploadFile(file,bucket)
    }

    const payload = {
        instructor_id: req.body.instructor_id,
        title: req.body.title,
        description: req.body.description,
        image: image
    }
    const result = await courseService.updateCourse(id,payload)
    if(result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
    }else{
        return getResponse(res, getHttpCode.OK, 'Success', result.data);
    }
}

export const destroy = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    const getCourse = await courseService.getCourseById(id)
    if(getCourse.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, getCourse.data, {});
    }else{
        const bucket = 'perwibuan-mooc/courses'
        deleteObject(bucket,getCourse.data.image)
        const result = await courseService.deleteCourse(id)
        if(result.status === 'failed') {
          return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
        }else{
          return getResponse(res, getHttpCode.OK, 'Success', result.data);
        }
    }
}

export const getCourseById = async (req: Request, res: Response,) => {
    const id = parseInt(req.params.id)
    const result = await courseService.getCourseById(id)
    if(result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
    }else{
        return getResponse(res, getHttpCode.OK, 'Success', result.data);
    }
}
