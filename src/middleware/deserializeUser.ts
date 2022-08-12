import { User } from "@/models/user";
import { signJWT, verifyJWT } from "@/utils/jwt";
import { NextFunction, Request, Response } from "express";

export default async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { PWA_LMS_AT: accessToken, PWA_LMS_RT: refreshToken } = req.cookies

  // If there is no accessToken continue to the next step
  if (!accessToken) return next()

  const { payload: accessTokenPayload, expired } = verifyJWT(accessToken)

  if (accessTokenPayload) {
    console.log(accessTokenPayload)
    return next()
  }

  //invalid access token
  const { payload: refreshTokenPayload } = expired && refreshToken ? verifyJWT(refreshToken) : { payload: null }

  if (!refreshTokenPayload) {
    return next()
  }

  // @ts-ignore
  const { email } = refreshTokenPayload

  const user = await User.findOne({
    where: {
      email
    }
  })

  // check if the user exist or has session
  if (!user || !user.has_session) {
    return next()
  }

  // User has session, create new accessToken
  const newAccessToken = signJWT({ email: user.email, role: user.role }, '30s')

  // Set the accessToken to cookies
  res.cookie('PWA_LMS_AT', newAccessToken, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true
  })

  // @ts-ignore
  req.user = verifyJWT(newAccessToken).payload

  return next()
}