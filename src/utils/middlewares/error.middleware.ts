import mongoose from 'mongoose';
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

  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ error: error.message });
  }

  if (error.status === 11000) {
    res.status(409).json({ status: 409, error: 'Duplicate key error' });
  }

  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({ error: 'Invalid ID format' });
  }

  const message = error.message || 'Something went wrong';

  res.status(status).json({
    status,
    message,
  });
};
