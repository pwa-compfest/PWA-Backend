import { number, z } from "zod";

export const getAllLecturesFromCourseSchema = z.object({
  courseId: z.number()
})

export const createLectureSchema = z.object({
  lecturesData: z.object({
    course_id: z.number(),
    title: z.string(),
    url: z.string(),
  }).array()
})

export const updateLectureSchema = z.object({
  lectureId: z.number(),
  courseId: z.number(),
  title: z.string(),
  url: z.string(),
})

export const deleteLectureSchema = z.object({
  lectureId: z.number(),
})