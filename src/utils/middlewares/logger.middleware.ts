import { logger } from '../logger';
import { NextFunction, Request, Response } from 'express';

export const LoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.info(
    `[${process.env.API_NAME}] ${req.method} ${
      req.originalUrl
    } \n ${JSON.stringify(req.body)}`,
  );

  next();
};
