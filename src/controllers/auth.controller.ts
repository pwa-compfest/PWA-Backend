import { AuthService } from "@/services/auth.service";
import { Request, Response } from "express";

const authService = new AuthService();

export const signUp = (req: Request, res: Response) => {
  const { email, password, confirmPassword } = req.body;
  return res
    .status(200)
    .json(authService.sendCredentials(email, password, confirmPassword));
};
