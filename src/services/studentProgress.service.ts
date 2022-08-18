import { StudentProgress, StudentProgressInput, StudentProgressOutput, Student, Course } from '@/models/index'
import { addStudentProgressSchema, getStudentProgressSchema, StudentProgressSchema } from '@/dto'
import { Op } from "sequelize";
import { AddStudentProgress, GetStudentProgress } from '@/common/types/studentProgress';

export class StudentProgressService {
  private failedOrSuccessRequest(status: string, code: number, data?: any) {
    return {
      status,
      code,
      data
    }
  }

  async getStudentProgress(payload: GetStudentProgress) {
    // Validate the payload
    const validateArgs = getStudentProgressSchema.safeParse({
      courseId: payload.courseId,
      studentId: payload.studentId
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    const studentProgressData = await StudentProgress.findOne({
      where: {
        student_id: payload.studentId,
        course_id: payload.courseId
      },
      attributes: ['id', 'visited_lecture']
    })
    if (!studentProgressData) {
      return this.failedOrSuccessRequest('failed', 400, 'Bad Request')
    }

    return this.failedOrSuccessRequest('success', 200, studentProgressData)
  }

  async addStudentProgress(payload: AddStudentProgress) {
    // Validate the payload
    const validateArgs = addStudentProgressSchema.safeParse({
      courseId: payload.courseId,
      lectureId: payload.lectureId,
      studentId: payload.studentId
    })

    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
    }

    // Check if the student progress is already exist or not
    const studentProgressData = await StudentProgress.findOne({
      where: {
        course_id: payload.courseId,
        student_id: payload.studentId
      }
    })


    if (studentProgressData) {
      let visitedLecture: Record<number, boolean> | null = studentProgressData.visited_lecture
      if (!visitedLecture) {
        visitedLecture = { [payload.lectureId]: true }
      } else {
        visitedLecture[payload.lectureId] = true
      }
      try {
        await StudentProgress.update({
          visited_lecture: studentProgressData.visited_lecture
        }, {
          where: {
            course_id: payload.courseId,
            student_id: payload.studentId
          }
        })
      } catch (error) {
        return this.failedOrSuccessRequest('failed', 400, error)
      }
    } else {
      const visitedLecture: Record<number, boolean> = { [payload.lectureId]: true }
      try {
        await StudentProgress.create({
          course_id: payload.courseId,
          student_id: payload.studentId,
          visited_lecture: visitedLecture
        })
      } catch (error) {
        return this.failedOrSuccessRequest('failed', 400, error)
      }
    }

    return this.failedOrSuccessRequest('success', 200, {})
  }
}
