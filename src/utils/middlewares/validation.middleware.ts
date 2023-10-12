import Joi from 'joi';
import { logger } from '../logger';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const ValidationMiddleware = (schema: Joi.Schema): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    try {
      const value = await schema.validateAsync(req.body, validationOptions);
      req.body = value;
      next();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const errors: string[] = [];

      e.details.forEach((error: Joi.ValidationErrorItem) => {
        logger.error(`Validation error: ${error.message}`);

        errors.push(error.message);
      });

      res.status(400).send({ errors: errors });
    }
  };
};
