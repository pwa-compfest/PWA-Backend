import { User } from "@/models/user";
import { signJWT, verifyJWT } from "@/utils/jwt";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import argon2 from 'argon2'

export default async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { PWA_LMS_AT: accessToken, PWA_LMS_RT: refreshToken } = req.cookies

  // If there is no accessToken continue to the next step
  if (!accessToken) return next()

  const { payload: accessTokenPayload, expired: accessTokenExpired } = verifyJWT(accessToken)

  if (accessTokenPayload) {
    // @ts-ignore
    const { email, role } = accessTokenPayload
    // @ts-ignore
    req.user = { email, role }
    return next()
  }

  //invalid access token
  const { payload: refreshTokenPayload, expired: refreshTokenExpired } = accessTokenExpired && refreshToken ? verifyJWT(refreshToken) : { payload: null, expired: true }

  // Check if refreshToken expired
  // @ts-ignore
  if (refreshTokenExpired && refreshTokenExpired.name === 'TokenExpiredError') {
    // @ts-ignore
    const { email } = jwt.verify(refreshToken, process.env.PUBLIC_KEY as string, { ignoreExpiration: true })
    // Delete the current refreshToken in database
    await User.update({
      // @ts-ignore
      refresh_token: null,
      has_session: 0
    }, {
      where: {
        email
      }
    })

    return next()
  }

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

  // Check if the current refreshToken === hashedRefreshToken in database
  const refreshTokenMatches = await argon2.verify(user.refresh_token, refreshToken)

  if (!refreshTokenMatches) {
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
  req.user = { email: user.email, role: user.role }

  return next()
}