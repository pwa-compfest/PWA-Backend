import { QuizService } from "@/services/quiz.service";
import { getResponse } from "@/utils";
import { Request, Response } from "express";

const quizService = new QuizService()

export const getAllQuizFromCourse = async (req: Request, res: Response) => {
  // Get the data from requset params & request user
  const { courseId } = req.params
  // @ts-ignore
  const { role } = req.user

  const result = await quizService.getAllQuizFromCourse({ courseId: +courseId, role })

  if (result.status === 'failed') {
    return getResponse(res, result.code, result.data, {})
  }

  return getResponse(res, result.code, `Success Get All Quiz from Course with ID ${courseId}`, result.data)
}

export const getSingleQuiz = async (req: Request, res: Response) => {
  // Get the data from request params and request user
  const { quizId, courseId } = req.params
  // @ts-ignore
  const { role } = req.user


  const result = await quizService.getSingleQuiz({ quizId: +quizId, courseId: +courseId, role })

  if (result.status === 'failed') {
    return getResponse(res, result.code, result.data, {})
  }

  return getResponse(res, result.code, `Success Get All Quiz with ID ${quizId}`, result.data)

}

export const createQuiz = async (req: Request, res: Response) => {
  // Get the data from request body
  const { courseId, title, description, questions } = req.body

  const result = await quizService.createQuiz({ courseId, title, description, questions })


  if (result.status === 'failed') {
    return getResponse(res, result.code, result.data, {})
  }

  return getResponse(res, result.code, `Quiz has been Created`, result.data)
}

export const updateQuiz = async (req: Request, res: Response) => {
  // Get the data from request body & params
  const { courseId, title, description, questions } = req.body
  const { quizId } = req.params

  const result = await quizService.updateQuiz({ courseId, title, description, questions, quizId: +quizId })


  if (result.status === 'failed') {
    return getResponse(res, result.code, result.data, {})
  }

  return getResponse(res, result.code, `Quiz with ID ${quizId} has been Updated`, result.data)
}

export const deleteQuiz = async (req: Request, res: Response) => {
  // Get the data from params
  const { quizId } = req.params

  const result = await quizService.deleteQuiz(+quizId)


  if (result.status === 'failed') {
    return getResponse(res, result.code, result.data, {})
  }

  return getResponse(res, result.code, `Quiz with ID ${quizId} has been Deleted`, result.data)
}