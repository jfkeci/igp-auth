import dotenv from 'dotenv';
import { App } from './app';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { StaticController } from './static/static.controller';
import { ConfigValidationService } from './utils/config/env-validation.config';
import { UserNotificationsController } from './user-notifications/user-notifications.controller';

dotenv.config();

new ConfigValidationService().validateEnv();

const app = new App(
  [
    new StaticController(),
    new AuthController(),
    new UsersController(),
    new UserNotificationsController()
  ],
  Number(process.env.API_PORT)
);

app.listen();
