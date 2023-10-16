import { Router } from 'express';
import { logger } from '../utils/logger';
import { StaticController } from './static.controller';
import { ConfigService } from '../utils/config/env.config';

export class StaticRoutes {
  private router = Router();
  private path = '/pages';

  private config = new ConfigService();

  public init(controller: StaticController): Router {
    const apiPrefix = this.config.get<string>('prefix');

    if (this.config.isEnv('development')) {
      // [x] Serve confirm email page
      logger.info(
        `${controller.constructor.name} GET ${apiPrefix}${this.path}/confirm-email page route`
      );
      this.router.get(
        `${this.path}/confirm-email`,
        controller.getConfirmEmailPage.bind(controller)
      );

      // [x] Serve error page page
      logger.info(
        `${controller.constructor.name} GET ${apiPrefix}${this.path}/error page route`
      );
      this.router.get(
        `${this.path}/error`,
        controller.getErrorPage.bind(controller)
      );
    }

    return this.router;
  }
}
