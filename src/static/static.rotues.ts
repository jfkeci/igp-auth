import { Router } from 'express';
import { logger } from '../utils/logger';
import { StaticController } from './static.controller';
import { ConfigService } from '../utils/config/env.config';

export class StaticRoutes {
  private router = Router();
  private path = '/pages';

  private config = new ConfigService();

  public init(controller: StaticController): Router {
    const apiEnv = this.config.get<string>('env');
    const apiPrefix = this.config.get<string>('prefix');

    if (apiEnv === 'development') {
      // [x] Serve confirm email pages
      logger.info(
        `${controller.constructor.name} GET ${apiPrefix}${this.path}/confirm-email route`,
      );

      this.router.get(
        `${this.path}/confirm-email`,
        controller.getConfirmEmailPage.bind(controller),
      );
    }

    return this.router;
  }
}
