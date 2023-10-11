import dotenv from 'dotenv';
import { App } from './app';
import { ConfigValidationService } from './utils/config/env-validation.config';
import { AuthController } from './auth/auth.controller';

dotenv.config();

new ConfigValidationService().validateEnv();

const app = new App([new AuthController()], Number(process.env.API_PORT));

app.listen();
