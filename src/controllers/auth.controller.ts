import { AuthService } from '@/services/auth.service';
import { getResponse } from '@/utils';
import { Request, Response } from 'express';

const authService = new AuthService();

export const signUp = async (req: Request, res: Response) => {
  const { email, password, confirmPassword, role } = req.body;

  const result = await authService.sendCredentials(email, password, confirmPassword, role);

  if (result.status === 'failed') {
    return getResponse(res, 403, 'Invalid Credentials', result.message);
  }

  return getResponse(res, 200, 'Sign Up Success', result.data);
};
