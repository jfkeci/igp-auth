import mongoose from 'mongoose';

export default interface User extends Document {
  _id: string;
  username?: string | null;
  email: string;
  password: string | null;
  isEmailVerified: boolean;
  emailVerificationCode?: string | null;
  passwordResetCode?: string | null;
  token?: string;

  createdAt: mongoose.Date;
  updatedAt: mongoose.Date;

  isModified: (property: string) => boolean;
}
