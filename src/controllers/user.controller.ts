import { UserService } from '../services/user.service'
import { Request, Response } from 'express'
import { getResponse,getHttpCode } from '@/utils'

const userService = new UserService()

const getUser = async (req: Request, res: Response) => {
    const data = await userService.getAllUsers()
    return getResponse(res, getHttpCode.OK, 'Berhasil Mendapatkan Data User', data)
}

export default getUser
