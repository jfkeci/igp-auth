import {
  loginValidationSchema,
  registerValidationSchema,
} from './auth.validation';
import { Router } from 'express';
import { AuthController } from './auth.controller';
import { ValidationMiddleware } from '../utils/middlewares/validation.middleware';
import { logger } from '../utils/logger';
import { ConfigService } from '../utils/config/env.config';

export class AuthRoutes {
  private router = Router();
  private path = '/auth';

  private config = new ConfigService();

  public init(controller: AuthController): Router {
    const apiPrefix = this.config.get<string>('prefix');

    // [ ] Login any user
    logger.info(
      `${controller.constructor.name} POST ${apiPrefix}${this.path}/login route`,
    );
    this.router.post(
      `${this.path}/login`,
      [ValidationMiddleware(loginValidationSchema)],
      controller.loginUser.bind(controller),
    );

    // [ ] Register user
    logger.info(
      `${controller.constructor.name} POST ${apiPrefix}${this.path}/register route`,
    );
    this.router.post(
      `${this.path}/register`,
      [ValidationMiddleware(registerValidationSchema)],
      controller.registerUser.bind(controller),
    );

    // [ ] Verify user

    // [ ] Set passwordResetCode and send email for password reset

    // [ ] Reset user password

    return this.router;
  }
}
