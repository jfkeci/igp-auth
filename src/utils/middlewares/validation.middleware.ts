import Joi from 'joi';
import { logger } from '../logger';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const ValidationMiddleware = (
  schema: Joi.Schema,
  subject?: 'body' | 'params' | 'query'
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    subject = subject ?? 'body';

    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    };

    try {
      let value;

      switch (subject) {
        case 'params':
          value = await schema.validateAsync(req.params, validationOptions);

          req.params = value;
          break;
        case 'query':
          value = await schema.validateAsync(req.query, validationOptions);

          req.query = value;
          break;
        default:
          value = await schema.validateAsync(req.body, validationOptions);

          req.body = value;
          break;
      }

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
