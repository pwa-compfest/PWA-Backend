import { Student } from "@/models";
import { getResponse } from "@/utils";
import { NextFunction, Request, Response } from "express";

export async function requireStudent(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  if (!req.user || !req.user.role === 'STUDENT') {
    return getResponse(res, 401, 'Unauthorized', {});
  }

  // Check if verified
  // @ts-ignore
  const userId = req.user.id
  const studentData = await Student.findOne({
    where: {
      user_id: userId
    }
  })

  if (!studentData) {
    return getResponse(res, 401, 'Unauthorized', {})
  }

  return next()
}
