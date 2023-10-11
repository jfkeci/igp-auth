import bcrypt from 'bcrypt';
import { UserService } from '../users/users.service';
import User from '../users/interfaces/user.interface';
import { JwtService } from '../utils/services/jwt.service';
import { HttpStatus } from '../utils/enums/http-status.enum';
import { VerifyEmailParams } from './interfaces/verify-email.params';
import { HttpException } from '../utils/classes/http-exception.class';
import { RedirectUrl } from '../utils/interfaces/redirect-uri.interface';
import { LoginUserParams } from './interfaces/login-user-params.interface';
import { RegisterUserParams } from './interfaces/register-user-params.interface';

export class AuthService {
  private jwtService: JwtService;
  private userService: UserService;

  constructor() {
    this.jwtService = new JwtService();
    this.userService = new UserService();
  }

  async registerUser(params: RegisterUserParams): Promise<User> {
    let existingUser = await this.userService._findOne({ email: params.email });

    if (existingUser) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Email taken');
    }

    if (params.username) {
      existingUser = await this.userService._findOne({
        username: params.username,
      });
    }

    if (existingUser) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Username taken');
    }

    const user = await this.userService.createOne({
      username: params.username ?? undefined,
      email: params.email,
      password: params.password,
      emailVerificaitonCode: 'fdasd8fas9fjd9s',
    });

    /**
     * TODO
     * - send verification email
     */

    return user;
  }

  async loginUser(params: LoginUserParams): Promise<User> {
    const user = await this.userService.findByEmail(params.email);

    if (!user.isEmailVerified) {
      throw new HttpException(HttpStatus.CONFLICT, 'Email not verified');
    }

    const isValidPassword = await bcrypt.compare(
      params.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        HttpStatus.UNAUTHORIZED,
        'Invalid email or password',
      );
    }

    user.token = await this.jwtService.generateToken({
      id: user._id.toString(),
    });

    return { ...user };
  }

  async verifyEmail(params: VerifyEmailParams): Promise<RedirectUrl> {
    const user = await this.userService._findById(params.userId);

    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'User not found');
    }

    if (user.isEmailVerified) {
      throw new HttpException(HttpStatus.CONFLICT, 'Email already verified');
    }

    if (user.emailVerificationCode !== params.code) {
      throw new HttpException(
        HttpStatus.CONFLICT,
        'Invalid email verification code',
      );
    }

    try {
      user.isEmailVerified = true;
      user.emailVerificationCode = null;

      await user.save();
    } catch (error) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Failed updating user');
    }

    /**
     * TODO
     * - change redirect url
     */
    return { url: 'https://github.com/jfkeci' };
  }
}
