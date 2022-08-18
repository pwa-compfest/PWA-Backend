import { StudentProgressService } from "@/services";
import { getResponse } from "@/utils";
import { Request, Response } from "express";

const studentProgressService = new StudentProgressService()

export const getStudentProgress = async (req: Request, res: Response) => {
  // Get the data from request params & request user
  const { courseId } = req.params
  // @ts-ignore
  const { studentId } = req.user

  const result = await studentProgressService.getStudentProgress({ courseId: +courseId, studentId })

  if (result.status === 'failed') {
    return getResponse(res, result.code, result.data, {})
  }

  return getResponse(res, result.code, `Success Get Student Progress Data`, result.data)
}


export const addStudentProgress = async (req: Request, res: Response) => {
  // Get the data from requst body and request user 
  const { courseId, lectureId } = req.body
  // @ts-ignore
  const { studentId } = req.user

  const result = await studentProgressService.addStudentProgress({ courseId, lectureId, studentId })

  if (result.status === 'failed') {
    return getResponse(res, result.code, result.data, {})
  }

  return getResponse(res, result.code, `Student Progress Saved`, result.data)
}

