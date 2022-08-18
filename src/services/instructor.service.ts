import { Instructor } from '@/models/index'

export class InstructorService {

    private failedOrSuccessRequest(status: string, data?: any) {
        return {
            status,
            data
        }
    }   

    async getInstructorId(id: number){
        const instructor = await Instructor.findOne({
            where: {
                user_id: id
            },
            attributes: ['id']
        })
        if(!instructor){
            return this.failedOrSuccessRequest('failed', 'instructor not found')
        }
        return this.failedOrSuccessRequest('success', instructor)
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
            return this.failedOrSuccessRequest('failed', 'Instructor not found')
        }
        return this.failedOrSuccessRequest('success', instructor)
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