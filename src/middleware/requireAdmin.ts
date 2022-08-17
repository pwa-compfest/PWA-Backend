import { getResponse } from "@/utils";
import { NextFunction, Request, Response } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  if (req.user.role !== 'ADMIN') {
    return getResponse(res, 401, 'Unauthorized', {});
  }

  return next()
}
