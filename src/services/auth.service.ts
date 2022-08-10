import { signUpSchema } from '@/dto';
import { User } from '@/models/user';
import bcrypt from 'bcryptjs'
export class AuthService {
  async sendCredentials(email: string, password: string, confirmPassword: string, role: string) {
    // validate the data
    const result = signUpSchema.safeParse({
      email,
      password,
      confirmPassword,
      role,
    });

    if (!result.success) {
      return {
        status: 'failed',
        message: result.error.format(),
      };
    }

    // TODO: Create the user and save it to db
    const hashedPassword = await this.hashData(password)
    let user
    try {
      user = await User.create({
        email,
        password: hashedPassword,
        role,
        refresh_token: 'fdaljdfasljfakj',
      })
    } catch (error) {
      return {
        status: 'failed',
        message: error
      }
    }

    return {
      status: 'success',
      data: {
        email: user.email,
        password: user.password,
        role: user.role,
      },
    };
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10)
  }
}
