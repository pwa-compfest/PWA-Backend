import { StudentProgress, Course } from '@/models/index'
import { StudentProgressSchema } from '@/dto'

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

    async getCourseByStudent(id: number, page: number, limit: number) {
        const course = await StudentProgress.findAll({
          where: {
            student_id: id
          },
          offset: (page - 1) * limit,
          limit: limit,
          include: [{
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'description', 'image']
          }],
        })
        if (!course) {
          return this.failedOrSuccessRequest('failed', 'Course not found')
        }
        return this.failedOrSuccessRequest('success', course)
      }

}