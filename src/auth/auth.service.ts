import bcrypt from 'bcrypt';
import { logger } from '../utils/logger';
import { UserService } from '../users/users.service';
import User from '../users/interfaces/user.interface';
import { ConfigService } from '../utils/config/env.config';
import { JwtService } from '../utils/services/jwt.service';
import { HttpStatus } from '../utils/enums/http-status.enum';
import { EmailService } from '../utils/services/email.service';
import { VerifyEmailParams } from './interfaces/verify-email.params';
import { HttpException } from '../utils/classes/http-exception.class';
import { RedirectUrl } from '../utils/interfaces/redirect-uri.interface';
import { LoginUserParams } from './interfaces/login-user-params.interface';
import { RegisterUserParams } from './interfaces/register-user-params.interface';
import { UserNotificationService } from '../user-notifications/user-notifications.service';

export class AuthService {
  private config: ConfigService;
  private jwtService: JwtService;
  private userService: UserService;
  private emailService: EmailService;
  private userNotificationService: UserNotificationService;

  constructor() {
    this.config = new ConfigService();
    this.jwtService = new JwtService();
    this.userService = new UserService();
    this.emailService = new EmailService();
    this.userNotificationService = new UserNotificationService();
  }

  async registerUser(
    params: RegisterUserParams,
    origin: string
  ): Promise<User> {
    let existingUser = await this.userService._findOne({ email: params.email });

    if (existingUser) {
      throw new HttpException(HttpStatus.CONFLICT, 'Email taken');
    }

    if (params.username) {
      existingUser = await this.userService._findOne({
        username: params.username
      });
    }

    if (existingUser) {
      throw new HttpException(HttpStatus.CONFLICT, 'Username taken');
    }

    const user = await this.userService.createOne({
      username: params.username ?? undefined,
      email: params.email,
      password: params.password
    });

    /**
     * TODO
     * - send verification email
     */

    const emailVerificationUrl = `${origin}/api/auth/emails/verify?userId=${user._id}&token=${user.emailVerificationCode}`;

    if (this.config.get<string>('env')) {
      logger.info(`Email verification url: ${emailVerificationUrl}`);
    }

    try {
      await this.emailService.sendEmail({
        from: 'sportscomplex@info.com',
        to: user.email,
        subject: 'iGP Auth account verification',
        html: `<html><h1>Confirm account</h1>
        <br><hr><br>
        <h3>Verification code: ${user.emailVerificationCode}</h3>
        <br><br>
        <h4>Click here: <a href="${emailVerificationUrl}">
        Confirm Email
        </a></h4></html>`
      });
    } catch (error) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Something went wrong|Failed sending email'
      );
    }

    return {
      ...user,
      password: null
    };
  }

  async loginUser(params: LoginUserParams): Promise<User> {
    const user = await this.userService.findByEmail(params.email);

    if (!user.isEmailVerified) {
      throw new HttpException(HttpStatus.CONFLICT, 'Email not verified');
    }

    const isValidPassword = await bcrypt.compare(
      params.password as string,
      user.password as string
    );

    if (!isValidPassword) {
      throw new HttpException(
        HttpStatus.UNAUTHORIZED,
        'Invalid email or password'
      );
    }

    /**
     * While testing using Postman, the postman client will automatically save the userId and token to the collection environment, this will enable you to use /api/users/:userId/notifications endpoints for getting user notificaitons (GET) and creating new user notificaitons (POST)
     */
    user.token = await this.jwtService.generateToken({
      id: user._id.toString()
    });

    return { ...user, password: null };
  }

  async verifyEmail(
    params: VerifyEmailParams,
    origin: string
  ): Promise<RedirectUrl> {
    const user = await this.userService._findById(params.userId);

    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'User not found');
    }

    if (user.isEmailVerified) {
      throw new HttpException(HttpStatus.CONFLICT, 'Email already verified');
    }

    if (user.emailVerificationCode !== params.token) {
      throw new HttpException(
        HttpStatus.CONFLICT,
        'Invalid email verification code'
      );
    }

    user.isEmailVerified = true;
    user.emailVerificationCode = null;

    try {
      await user.save();
    } catch (error) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Failed updating user');
    }

    const authToken = await this.jwtService.generateToken({
      id: user._id.toString()
    });

    new Promise<void>((resolve, reject) => {
      setImmediate(async () => {
        try {
          await this.userNotificationService.createUserNotification({
            userId: user._id as string,
            title: 'Account creation completed',
            body: 'Your email is verified'
          });
        } catch (error) {
          logger.error(error);
          reject(error);
        }

        resolve();
      });
    });

    return {
      url: `${origin}/api/pages/confirm-email?userId=${user._id}&token=${authToken}`
    };
  }
}
