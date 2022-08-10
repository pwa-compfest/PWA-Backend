import { UserService } from '../services/user.service'
import { Request, Response } from 'express'
import { getResponse, getHttpCode } from '@/utils'

const userService = new UserService()

export const store = async (req: Request, res: Response) => {
  const data = await userService.addUser(req.body)
  return getResponse(res, getHttpCode.OK, 'User created successfully', data)
}

export const get = async (req: Request, res: Response) => {
  const data = await userService.getAllUsers()
  return getResponse(res, getHttpCode.OK, 'Berhasil Mendapatkan Data User', data)
}

export const getById = async (req: Request, res: Response) => {
  const data = await userService.getUserById(req.params.id)
  return getResponse(res, getHttpCode.OK, 'Berhasil Mendapatkan Data User', data)
}

