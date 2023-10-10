import Joi from 'joi';

export class ConfigValidationService {
  private envValidationConfig = Joi.object({
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
    API_KEY: Joi.string().required(),
  }).unknown();

  public validateEnv(): void {
    const { error } = this.envValidationConfig.validate(process.env);

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
  }
}
