import { logger } from '../logger';
import { NextFunction, Request, Response } from 'express';

export const LoggerMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  logger.http(
    `[${process.env.API_NAME}] REQUEST ${req.method} ${
      req.originalUrl
    } \n- Body ${JSON.stringify(req.body)}\n- Params: ${JSON.stringify(
      req.params
    )}\n- Query: ${JSON.stringify(req.query)}`
  );

  next();
};
