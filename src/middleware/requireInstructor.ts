import { Instructor } from "@/models";
import { getResponse } from "@/utils";
import { NextFunction, Request, Response } from "express";

export async function requireInstructor(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  if (!req.user || !req.user.role === 'INSTRUCTOR') {
    return getResponse(res, 401, 'Unauthorized', {});
  }

  // Check if verified
  // @ts-ignore
  const userId = req.user.id
  const instructorData = await Instructor.findOne({
    where: {
      user_id: userId
    }
  })

  if (!instructorData || !instructorData.is_verified) {
    return getResponse(res, 401, 'Unauthorized', {})
  }

  return next()
}
