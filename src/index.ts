import dotenv from 'dotenv';
import { App } from './app';
import { AuthController } from './auth/auth.controller';
import { ConfigValidationService } from './utils/config/env-validation.config';
import { UserNotificationsController } from './user-notifications/user-notifications.controller';
import { UsersController } from './users/users.controller';

dotenv.config();

new ConfigValidationService().validateEnv();

const app = new App(
  [
    new AuthController(),
    new UsersController(),
    new UserNotificationsController(),
  ],
  Number(process.env.API_PORT),
);

app.listen();
