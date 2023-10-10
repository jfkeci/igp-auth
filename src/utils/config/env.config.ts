interface EnvConfig {
  port: string;
  env: string;
  dbUrl: string;
}

export class ConfigService {
  private envConfig: EnvConfig = {
    port: process.env.PORT as string,
    env: process.env.NODE_ENV as string,
    dbUrl: process.env.DATABASE_URL as string,
  };

  public get<T>(key: keyof typeof this.envConfig): T {
    return this.envConfig[key] as T;
  }
}
