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

export const getCurrentUserData = async (req: Request, res: Response) => {
  // Get user email and role from access token
  // @ts-ignore
  const { id, email, role } = req.user

  let data: any

  // Check the role and apply functionality based on that role
  if (role === 'INSTRUCTOR') {
    // Get the INSTRUCTOR data
    const instructorData = await userService.getInstructorData(id)

    data = instructorData.data
  } else if (role === 'STUDENT') {
    // Get the STUDENT data
    const studentData = await userService.getStudentData(id)

    data = studentData.data
  }else if (role === 'ADMIN') {
    const adminData = await userService.getAdminData(id)

    data = adminData.data
  }
  data = { id, email, role, ...data.dataValues }

  return getResponse(res, 200, `Success Get User Data with ID ${id}`, data)
}

export const getAllPendingInstructorData = async (req: Request, res: Response) => {
  const result = await userService.getAllPendingInstructorData()

  return getResponse(res, 200, 'Success Get All Pending Instructor Data', result.data)
}
