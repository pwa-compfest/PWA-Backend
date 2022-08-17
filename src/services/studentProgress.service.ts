import { StudentProgress, StudentProgressInput,StudentProgressOutput, Student, Course } from '@/models/index'
import { StudentProgressSchema } from '@/dto'
import { Op } from "sequelize";

export class StudentProgressService {
    private failedOrSuccessRequest(status: string, data?: any) {
        return {
          status,
          data
        }
    }

    async enrollCourse(course_id: number, student_id: number) {
        const result = StudentProgressSchema.safeParse({
            course_id: course_id,
            student_id: student_id,
        });
        if (!result.success) {
            return this.failedOrSuccessRequest('failed', result.error)
        }
        const course = await StudentProgress.create({
            course_id: course_id,
            student_id: student_id
        })
        return this.failedOrSuccessRequest('success', course)
    }

}