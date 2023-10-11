export default interface User extends Document {
  _id: string;
  username?: string | null;
  email: string;
  password: string;
  isEmailVerified: boolean;
  emailVerificationCode?: string | null;
  passwordResetCode?: string | null;
  token?: string;

  isValidPassword(password: string): Promise<Error | boolean>;
}
