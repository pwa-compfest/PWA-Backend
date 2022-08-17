import { LectureService } from "@/services/lecture.service";
import { getHttpCode, getResponse } from "@/utils";
import { Request, Response } from "express";

const lectureService = new LectureService()

export const getAllLecturesFromCourse = async (req: Request, res: Response) => {
  // Get the course id from request param
  const { courseId } = req.params

  // Just retrieve the data from database
  const result = await lectureService.getAllLecturesFromCourse(+courseId)

  if (result.status === 'failed') {
    return getResponse(res, result.code, result.data, {})
  }

  return getResponse(res, result.code, `Success Get All Lectures from Course with ID ${courseId}`, result.data)
}

export const createLecture = async (req: Request, res: Response) => {
  // Get the data from request body
  const { lecturesData } = req.body

  const result = await lectureService.createLecture(lecturesData)

  if (result.status === 'failed') {
    return getResponse(res, result.code, result.data, {})
  }

  return getResponse(res, result.code, `Lecture Created`, result.data)
}

export const updateLecture = async (req: Request, res: Response) => {
  // Get the data from request params & body
  const { lectureId } = req.params
  const { courseId, title, url } = req.body

  const result = await lectureService.updateLecture({ lectureId: +lectureId, courseId: +courseId, title, url })

  if (result.status === 'failed') {
    return getResponse(res, result.code, result.data, {})
  }

  return getResponse(res, result.code, `Lecture with ID ${lectureId} has been Updated`, result.data)
}

export const deleteLecture = async (req: Request, res: Response) => {
  // Get the data from requst params
  const { lectureId } = req.params

  const result = await lectureService.deleteLecture(+lectureId)

  if (result.status === 'failed') {
    return getResponse(res, result.code, result.data, {})
  }

  return getResponse(res, result.code, `Lecture with ID ${lectureId} has been Deleted`, result.data)
}