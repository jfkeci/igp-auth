import Joi from 'joi';
import { logger } from '../logger';

export class ConfigValidationService {
  private envValidationConfig = Joi.object({
    API_PORT: Joi.number().default(3000),
    API_ENV: Joi.string()
      .valid('development', 'production')
      .default('development'),
    DATABASE_URL: Joi.string().required(),
    API_NAME: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRY: Joi.number().required(),
  }).unknown();

  public validateEnv(): void {
    logger.info('VALIDATING ENV');

    const { error } = this.envValidationConfig.validate(process.env);

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
  }
}
