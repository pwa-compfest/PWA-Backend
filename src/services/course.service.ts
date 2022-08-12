import { Course,CourseInput,CourseOutput } from '@/models/index'
import { CourseSchema } from '@/dto'

export class CourseService {

    async createCourse(payload: CourseInput) {
        const result = CourseSchema.safeParse({
            title: payload.title,
            description: payload.description,
            image: payload.image,
        });
        if(!result.success) {
            return this.failedOrSuccessRequest('failed', result.error)
        }

        const course = await Course.create(payload)
        return this.failedOrSuccessRequest('success', course)
    }

    async getAllCourses(): Promise<CourseOutput[]> {
        return await Course.findAll({
            where:{
                is_verified: true
            },
            attributes: ['id', 'instructor_id', 'title', 'description', 'image', 'is_verified']
        })
    }

    async getCourseByInstructorId(id: number): Promise<CourseOutput[]> {
        return await Course.findAll({
            where:{
                instructor_id: id,
            },
            attributes: ['id', 'instructor_id', 'title', 'description', 'image', 'is_verified']
        })
    }

    async updateCourse(id: number, payload: CourseInput) {
        const result = CourseSchema.safeParse({
            title: payload.title,
            description: payload.description,
            image: payload.image,
        });
        if(!result.success) {
            return this.failedOrSuccessRequest('failed', result.error)
        }
        const course = await Course.update(payload, {
            where: {
                id: id
            },
            returning: true
        })
        if(!course) {
            return this.failedOrSuccessRequest('failed', 'Course Not Found')
        }
        return this.failedOrSuccessRequest('success', course)
    }

    async getCourseById(id: number){
        const course = await Course.findByPk(id)
          if(course == null){
              return this.failedOrSuccessRequest('failed', 'Course not found')
          }else{
              return this.failedOrSuccessRequest('success', course)
          }
    }

    async deleteCourse(id: number) {
        const course = await Course.destroy({
            where: {
                id: id
            }
        })
        if(!course) {
            return this.failedOrSuccessRequest('failed', 'Course not found')
        }else{
            return this.failedOrSuccessRequest('Success Delete Course', course)
        }
    }

    failedOrSuccessRequest(status: string, data?: any) {
        return {
          status,
          data
        }
    }
}
