import { AuthRoutes } from './auth.routes';
import { AuthService } from './auth.service';
import User from '../users/interfaces/user.interface';
import { HttpStatus } from '../utils/enums/http-status.enum';
import { ResponseType } from '../utils/enums/response-type.enum';
import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../utils/interfaces/controller.interface';
import { LoginUserParams } from './interfaces/login-user-params.interface';
import { ResponseFormat } from '../utils/interfaces/response-format.interface';
import { RegisterUserParams } from './interfaces/register-user-params.interface';

export class AuthController implements Controller {
  public router = Router();

  private authService = new AuthService();

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router = new AuthRoutes().init(this);
  }

  async loginUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { email, password } = req.body;

    try {
      const result = await this.authService.loginUser({
        email,
        password,
      } as LoginUserParams);

      const response: ResponseFormat<User> = {
        type: ResponseType.User,
        status: HttpStatus.OK,
        data: result,
      };

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async registerUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { username, email, password, confirmPassword } = req.body;

    try {
      const result = await this.authService.registerUser({
        confirmPassword,
        password,
        username,
        email,
      } as RegisterUserParams);

      const response: ResponseFormat<User> = {
        type: ResponseType.User,
        status: HttpStatus.CREATED,
        data: result,
      };

      res.status(HttpStatus.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }
}
