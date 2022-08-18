import { z } from "zod";

export const getAllQuizFromCourseSchema = z.object({
  courseId: z.number(),
  role: z.string()
})

export const getSingleQuizSchema = z.object({
  quizId: z.number(),
  courseId: z.number(),
  role: z.string()
})

export const createQuizSchema = z.object({
  courseId: z.number(),
  title: z.string(),
  description: z.string(),
  questions: z.object({
    question: z.string(),
    answer: z.object({
      A: z.string(),
      B: z.string(),
      C: z.string(),
      D: z.string()
    }),
    answer_right: z.string()
  }).array().nonempty()
})

export const updateQuizSchema = z.object({
  courseId: z.number(),
  quizId: z.number(),
  title: z.string(),
  description: z.string(),
  questions: z.object({
    id: z.number(),
    question: z.string(),
    answer: z.object({
      A: z.string(),
      B: z.string(),
      C: z.string(),
      D: z.string()
    }),
    answer_right: z.string()
  }).array().nonempty()
})

export const deleteQuizSchema = z.object({
  quizId: z.number()
})