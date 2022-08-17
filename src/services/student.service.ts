import { Student } from '@/models/index'

export class StudentService {

    async getStudentId(id: number){
        const student = await Student.findOne({
            where: {
                user_id: id
            },
            attributes: ['id']
        })
        return student
    }

}