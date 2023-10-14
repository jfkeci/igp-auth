import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import User from './interfaces/user.interface';

//user schema
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID.
 *           example: 62124b4fbed6940f1b55d992
 *         username:
 *           type: string
 *           description: User first name and last name.
 *           example: John Doe
 *         email:
 *           type: string
 *           description: User email.
 *           example: john.doe@mail.com
 *         createdAt:
 *           type: string
 *           description: Date and time when the user was created
 *           example: 2022-02-20T13:51:31.537+00:00
 *         updatedAt:
 *           type: string
 *           description: Date and time when the user was updated
 *           example: 2022-02-20T13:51:31.537+00:00
 */
const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCode: {
      type: String,
      default: () => crypto.randomBytes(32).toString('hex'),
    },
    passwordResetCode: {
      type: String,
    },
  },
  { timestamps: true },
);

UserSchema.pre<User>('save', async function (next) {
  const hash = await bcrypt.hash(this.password as string, 10);

  this.password = hash;

  next();
});

UserSchema.methods.isValidPassword = async function (
  password: string,
): Promise<Error | boolean> {
  return await bcrypt.compare(password, this.password);
};

export default model<User>('User', UserSchema);

// Register user schema
/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: User first name and last name.
 *           example: John Doe
 *         email:
 *           type: string
 *           description: User email.
 *           example: john.doe@mail.com
 *         password:
 *           type: string
 *           description: User password.
 *           example: password
 *     LoginUser:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: User email.
 *           example: john.doe@mail.com
 *         password:
 *           type: string
 *           description: User password.
 *           example: password
 *     Token:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Auth token.
 *           example: token
 */
