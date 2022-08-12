import { CourseService } from '@/services/course.service'
import { Request, Response } from 'express'
import { getResponse, getHttpCode } from '@/utils'
import {uploadFile} from '@/utils/s3'
import fs from 'fs'

const courseService = new CourseService()

export const get = async (req: Request, res: Response) => {
    const data = await courseService.getAllCourses()
    return getResponse(res, getHttpCode.OK, 'Berhasil Mendapatkan Data Course', data)
}

export const store = async (req: Request, res: Response) => {
    const file = req.file
    uploadFile(file)
    const data = await courseService.createCourse(req.body)
    return getResponse(res, getHttpCode.OK, 'Berhasil Menambahkan Data Course', data)
}