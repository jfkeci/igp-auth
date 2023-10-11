interface EnvConfig {
  port: string;
  env: string;
  dbUrl: string;
  jwtSecret: string;
  jwtExpiry: number;
}

export class ConfigService {
  private envConfig: EnvConfig = {
    port: process.env.PORT as string,
    env: process.env.NODE_ENV as string,
    dbUrl: process.env.DATABASE_URL as string,
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiry: Number(process.env.JWT_EXPIRY) as number,
  };

  public get<T>(key: keyof typeof this.envConfig): T {
    return this.envConfig[key] as T;
  }
}
