import { Router } from 'express';
import { logger } from '../utils/logger';
import { ConfigService } from '../utils/config/env.config';
import { AuthMiddleware } from '../utils/middlewares/auth.middleware';
import { userIdParamValidationSchema } from '../users/user.validation';
import { UserNotificationsController } from './user-notifications.controller';
import { ValidationMiddleware } from '../utils/middlewares/validation.middleware';
import { createUserNotificationValidationSchema } from './user-notifications.validation';

export class UserNotificationRoutes {
  private router = Router();
  private path = '/:userId/notifications';

  private config = new ConfigService();

  public init(controller: UserNotificationsController): Router {
    const apiPrefix = this.config.get<string>('prefix');

    // [x] Get user notifications
    logger.info(
      `${controller.constructor.name} get ${apiPrefix}${this.path} route`,
    );
    this.router.get(
      ``,
      [
        AuthMiddleware(),
        ValidationMiddleware(userIdParamValidationSchema, 'params'),
      ],
      controller.getUserNotifications.bind(controller),
    );

    // [x] Create user notifications
    logger.info(
      `${controller.constructor.name} POST ${apiPrefix}${this.path} route`,
    );
    this.router.post(
      ``,
      [
        AuthMiddleware(),
        ValidationMiddleware(userIdParamValidationSchema, 'params'),
        ValidationMiddleware(createUserNotificationValidationSchema, 'body'),
      ],
      controller.createUserNotification.bind(controller),
    );

    return this.router;
  }
}
