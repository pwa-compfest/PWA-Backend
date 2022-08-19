import { InstructorService } from '@/services/index'
import { Request, Response } from 'express'
import { getResponse,getHttpCode} from '@/utils'

const instructorService = new InstructorService()

export const getInstructor = async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
    let result = await instructorService.getInstructor(page, limit)
    let total = await instructorService.count(limit)
    if (result.status === 'failed') {
        return getResponse(res, getHttpCode.BAD_REQUEST, 'Failed Get Instructor', total)
    }
    return getResponse(res, getHttpCode.OK, 'Success Get Instructor', result.data, total)
}