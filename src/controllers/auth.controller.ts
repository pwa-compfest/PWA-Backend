import { AdminDetails, InstructorDetails, StudentDetails } from '@/common/types/user';
import { AuthService } from '@/services/auth.service';
import { getResponse } from '@/utils';
import { Request, Response } from 'express';
import { resourceLimits } from 'worker_threads';

const authService = new AuthService();

export const signUp = async (req: Request, res: Response) => {
  const { email, password, confirmPassword, role, name, photo, phoneNumber, gender } = req.body;

  let data: StudentDetails | InstructorDetails | AdminDetails

  if (role === 'ADMIN') {
    data = { role }
  } else if (role === 'INSTRUCTOR') {
    const { nip, expertise } = req.body
    data = { role, nip, name, gender, expertise, phoneNumber, photo }
  } else if (role === 'STUDENT') {
    const { nisn, grade, majority } = req.body
    data = { role, nisn, name, grade, gender, majority, phoneNumber, photo }
  } else {
    return getResponse(res, 403, 'Invalid Role', {})
  }

  const result = await authService.signUp(email, password, confirmPassword, data);

  if (result.status === 'failed') {
    return getResponse(res, 403, result.data, {});
  }

  return getResponse(res, 200, 'Email has been send', result.data);
};

export const verifyAccount = async (req: Request, res: Response) => {
  const { token, userId } = req.body;

  const result = await authService.verifyAccount(token, userId)

  if (result.status === 'failed') {
    return getResponse(res, 403, result.data, {})
  }

  const { accessToken, refreshToken } = result.data

  res.cookie('PWA_LMS_AT', accessToken, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day ,
    httpOnly: true,
  })
  res.cookie('PWA_LMS_RT', refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    httpOnly: true,
  })

  return getResponse(res, 200, 'Account Activated', {})
}

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const result = await authService.signIn(email, password)
  if (result.status === 'failed') {
    return getResponse(res, 403, result.data, {})
  }
  const { accessToken, refreshToken } = result.data

  res.cookie('PWA_LMS_AT', accessToken, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day ,
    httpOnly: true,
  })
  res.cookie('PWA_LMS_RT', refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    httpOnly: true,
  })
  return getResponse(res, 200, 'Sign In Success', {})
}


export const signOut = async (req: Request, res: Response) => {
  // @ts-ignore
  const { email } = req.user
  const result = await authService.signOut(email)
  if (result.status === 'failed') {
    return getResponse(res, 403, result.data, {})
  }
  // Remove accessToken and refreshToken from cookie
  res.cookie('PWA_LMS_AT', '', {
    maxAge: -1,
    httpOnly: true,
  })
  res.cookie('PWA_LMS_RT', '', {
    maxAge: -1,
    httpOnly: true
  })
  return getResponse(res, 200, 'Sign Out Success', {})
}

export const sendChangePasswordEmail = async (req: Request, res: Response) => {
  const { email } = req.body

  const result = await authService.sendChangePasswordEmail(email)
  if (result.status === 'failed') {
    return getResponse(res, 403, result.data, {})
  }

  return getResponse(res, 200, 'Email has been sent', {})
}

export const verifyNewPassword = async (req: Request, res: Response) => {
  const { token, userId, password, confirmPassword } = req.body
  const result = await authService.verifyNewPassword(token, userId, password, confirmPassword)

  if (result.status === 'failed') {
    return getResponse(res, 403, result.data, {})
  }

  return getResponse(res, 200, 'Password has been reset', {})
}
