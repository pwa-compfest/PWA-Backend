import { z } from "zod";

export const createStudentQuizSchema = z.object({
  quizId: z.number(),
  studentId: z.number(),
  questionData: z.object({
    questionId: z.number(),
    studentAnswer: z.string(),
  }).array().nonempty()
})