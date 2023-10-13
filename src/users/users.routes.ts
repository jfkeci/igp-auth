import { Router } from 'express';
import { logger } from '../utils/logger';
import { UsersController } from './users.controller';
import { ConfigService } from '../utils/config/env.config';

export class UserRoutes {
  private router = Router();
  private path = '/users';

  private config = new ConfigService();

  public init(controller: UsersController): Router {
    const apiEnv = this.config.get<string>('env');
    const apiPrefix = this.config.get<string>('prefix');

    // Get users routes is available only for development testing
    if (apiEnv === 'development') {
      // [x] Get users
      logger.info(
        `${controller.constructor.name} GET ${apiPrefix}${this.path} route`,
      );
      this.router.get(`${this.path}`, controller.getUsers);
    }

    return this.router;
  }
}
