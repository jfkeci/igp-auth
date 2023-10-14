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
import { getRequestOrigin } from '../utils/request-origin.util';

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
    const origin = getRequestOrigin(req);

    const { username, email, password, confirmPassword } = req.body;

    try {
      await this.authService.registerUser(
        {
          confirmPassword,
          password,
          username,
          email,
        } as RegisterUserParams,
        origin,
      );

      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }

  async verifyUserEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const origin = getRequestOrigin(req);

    try {
      const { userId, token } = req.query;

      const result = await this.authService.verifyEmail(
        { userId: userId as string, token: token as string },
        origin,
      );

      res.status(HttpStatus.SEE_OTHER).redirect(result.url);
    } catch (error) {
      next(error);
    }
  }
}
