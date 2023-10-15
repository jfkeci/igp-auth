interface EnvConfig {
  port: string;
  env: string;
  dbUrl: string;
  prefix: string;
  jwtSecret: string;
  jwtExpiry: number;
  logLevel: string;
  logRotationEnabled: boolean;
}

export class ConfigService {
  private envConfig: EnvConfig = {
    port: process.env.API_PORT as string,
    env: process.env.API_ENV as string,
    prefix: process.env.API_PREFIX as string,
    dbUrl: process.env.DATABASE_URL as string,
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiry: Number(process.env.JWT_EXPIRY) as number,
    logLevel: process.env.LOG_LEVEL as string,
    logRotationEnabled: JSON.parse(
      process.env.LOG_ROTATION_ENABLED ?? 'false',
    ) as boolean,
  };

  public get<T>(key: keyof typeof this.envConfig): T {
    return this.envConfig[key] as T;
  }

  public isEnv(env: 'development' | 'production'): boolean {
    return this.envConfig.env === env;
  }
}
