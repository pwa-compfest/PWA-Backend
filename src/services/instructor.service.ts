import { Instructor } from '@/models/index'
import { getInstructorIdSchema } from '@/dto'

export class InstructorService {

    private failedOrSuccessRequest(status: string, code: number, data?: any) {
        return {
            status,
            code,
            data
        }
    }

    async getInstructorId(id: number){

        const validateArgs = getInstructorIdSchema.safeParse({
            userId: id
        })
        
        if (!validateArgs.success) {
            return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
        }

        const instructor = await Instructor.findOne({
            where: {
                user_id: id
            },
            attributes: ['id']
        })
        if(!instructor){
            return this.failedOrSuccessRequest('failed', 400, 'Bad Request')
        }
        return this.failedOrSuccessRequest('success',200,instructor)
    }

    async getInstructor(page: number, limit: number) {
        const instructor = await Instructor.findAll({
            where: {
                is_verified: null
            },
            offset: (page - 1) * limit,
            limit: limit,
        })
        if (!instructor) {
            return this.failedOrSuccessRequest('failed',400,'Instructor not found')
        }
        return this.failedOrSuccessRequest('success',200,instructor)
    }

    async count(limit: number) {
        const course = await Instructor.count({
          where: {
            is_verified: null
          }
        })
        const totalCourse = {
          totalRows: course,
          totalPage: Math.ceil(course / limit)
        }
        return totalCourse
      }

}
