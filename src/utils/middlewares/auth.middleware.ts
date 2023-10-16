import { JwtService } from '../services/jwt.service';
import { HttpStatus } from '../enums/http-status.enum';
import { UserService } from '../../users/users.service';
import { HttpException } from '../classes/http-exception.class';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const AuthMiddleware = (): RequestHandler => {
  return async (
    req: Request,
    _: Response,
    next: NextFunction
  ): Promise<void> => {
    const jwtService = new JwtService();
    const userService = new UserService();

    const token = jwtService.getTokenFromHeaders(req);

    if (!token) {
      return next(new HttpException(HttpStatus.UNAUTHORIZED, 'Unauthorised'));
    }

    const id = jwtService.verify(token);

    if (!id) {
      return next(new HttpException(HttpStatus.UNAUTHORIZED, 'Unauthorised'));
    }

    const user = userService._findById(id);

    if (!user) {
      return next(new HttpException(HttpStatus.UNAUTHORIZED, 'Unauthorised'));
    }

    next();
  };
};
