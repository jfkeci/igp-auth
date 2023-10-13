import { Router } from 'express';
import { UserNotificationsController } from './user-notifications.controller';
import { logger } from '../utils/logger';
import { ConfigService } from '../utils/config/env.config';

export class UserNotificationRoutes {
  private router = Router();
  private path = '/:userId/notifications';

  private config = new ConfigService();

  public init(controller: UserNotificationsController): Router {
    const apiPrefix = this.config.get<string>('prefix');

    // [ ] Get user notifications
    logger.info(
      `${controller.constructor.name} POST ${apiPrefix}${this.path} route`,
    );
    this.router.get(``, controller.getUserNotifications.bind(controller));

    return this.router;
  }
}
