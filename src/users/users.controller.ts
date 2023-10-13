import { UserRoutes } from './users.routes';
import { UserService } from './users.service';
import User from './interfaces/user.interface';
import { HttpStatus } from '../utils/enums/http-status.enum';
import { ResponseType } from '../utils/enums/response-type.enum';
import Controller from '../utils/interfaces/controller.interface';
import { NextFunction, Request, Response, Router } from 'express';
import { ResponseFormat } from '../utils/interfaces/response-format.interface';

export class UsersController implements Controller {
  public router = Router();

  private userService: UserService;

  constructor() {
    this.userService = new UserService();

    this.initRoutes();
  }

  private initRoutes(): void {
    this.router = new UserRoutes().init(this);
  }

  async getUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.userService._find();

      const response: ResponseFormat<User[]> = {
        status: HttpStatus.OK,
        type: ResponseType.User,
        data: result,
      };

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}
