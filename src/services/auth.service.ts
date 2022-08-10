export class AuthService {
  sendCredentials(email: string, password: string, confirmPassword: string) {
    return {
      email,
      password,
      confirmPassword,
    };
  }
}
