import { logger } from '../logger';
import { ConfigService } from '../config/env.config';
import { NextFunction, Request, Response } from 'express';

export const LoggerMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const config = new ConfigService();

  logger.http(
    `[${process.env.API_NAME}] REQUEST ${req.method} ${
      req.originalUrl
    } \n- Body ${JSON.stringify(req.body)}\n- Params: ${JSON.stringify(
      req.params
    )}\n- Query: ${JSON.stringify(req.query)}`
  );

  next();
};
