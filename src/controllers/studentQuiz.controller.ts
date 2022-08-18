import { StudentQuizService } from "@/services"
import { getResponse } from "@/utils"
import { Request, Response } from "express"

const studentQuiz = new StudentQuizService()
export const createStudentQuiz = async (req: Request, res: Response) => {
  // Get the data from request body & request user
  const { quizId, questionData } = req.body
  // @ts-ignore
  const { studentId } = req.user

  const result = await studentQuiz.createStudentQuiz({ quizId: +quizId, studentId, questionData })

  if (result.status === 'failed') {
    return getResponse(res, result.code, result.data, {})
  }

  return getResponse(res, result.code, `Quiz Result has been Saved`, result.data)
}