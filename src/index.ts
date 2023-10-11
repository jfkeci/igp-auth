import dotenv from 'dotenv';
import { App } from './app';
import { AuthController } from './auth/auth.controller';
import { ConfigValidationService } from './utils/config/env-validation.config';

dotenv.config();

new ConfigValidationService().validateEnv();

const app = new App([new AuthController()], Number(process.env.API_PORT));

app.listen();
