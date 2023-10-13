import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../classes/http-exception.class';

export const ErrorMiddleware = (
  error: HttpException,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  const status = error instanceof HttpException ? error.status : 500;

  const message = error.message || 'Something went wrong';

  res.status(status).json({
    status,
    message,
  });
};
