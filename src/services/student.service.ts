import { Student } from '@/models/index'

export class StudentService {

    async getStudentByUser(id: number){
        const student = await Student.findOne({
            where: {
                user_id: id
            }
        })
        return student
    }

}