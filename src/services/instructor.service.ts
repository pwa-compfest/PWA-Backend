import { Instructor } from '@/models/index'

export class InstructorService {

    async getInstructorId(id: number){
        const instructor = await Instructor.findOne({
            where: {
                user_id: id
            },
            attributes: ['id']
        })
        return instructor
    }

}