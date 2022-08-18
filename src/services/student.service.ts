import { Student } from '@/models/index'
import { getStudentIdSchema } from '@/dto'

export class StudentService {

    failedOrSuccessRequest(status: string, code: number, data?: any) {
        return {
            status,
            code,
            data
        }
    }

    async getStudentId(id: number){

        const validateArgs = getStudentIdSchema.safeParse({
            userId: id
        })

        if (!validateArgs.success) {
            return this.failedOrSuccessRequest('failed', 400, validateArgs.error.format())
        }

        const student = await Student.findOne({
            where: {
                user_id: id
            },
            attributes: ['id']
        })
        if(!student){
            return this.failedOrSuccessRequest('failed', 400, 'Failed get student')
        }
        return this.failedOrSuccessRequest('success',200,student)
    }

}