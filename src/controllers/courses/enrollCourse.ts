import { StudentProgressService, StudentService } from '@/services/index'
import { Request, Response } from 'express'
import { getResponse, getHttpCode } from '@/utils'

const studentProgressService = new StudentProgressService()
const studentService = new StudentService()

export const enrollCourse = async (req: Request, res: Response) => {
    const course_id = parseInt(req.params.id)
    const user_id = parseInt(req.user.id)

    const student_id = await studentService.getStudentId(user_id)

    if(!student_id){
        return getResponse(res, getHttpCode.BAD_REQUEST, 'Student Not Found', null)
    }

    const result = await studentProgressService.enrollCourse(course_id,student_id.id)
    if(result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, result.data, {});
    }else{
        return getResponse(res, getHttpCode.OK, 'Success Enroll Course', result.data);
    }
}