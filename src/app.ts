import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import { logger } from './utils/logger';
import express, { Application } from 'express';
import { ConfigService } from './utils/config/env.config';
import { swaggerDocs } from './utils/config/swagger.config';
import Controller from './utils/interfaces/controller.interface';
import { ErrorMiddleware } from './utils/middlewares/error.middleware';
import { LoggerMiddleware } from './utils/middlewares/logger.middleware';

export class App {
  private config: ConfigService;

  public port: number;
  public express: Application;

  constructor(controllers: Controller[], port: number) {
    logger.info(`Starting the app...`);

    this.config = new ConfigService();

    this.express = express();
    this.port = port;

    this.initMiddleware();
    this.initErrorMiddleware();
    this.initLoggerMiddleware();
    this.initSwagger();

    this.initControllers(controllers);

    this.express.use('/api', (req, res) => {
      res.send('Welcome to iGP Auth API');
    });

    this.express.use('/', (req, res) => {
      res.send('Welcome to iGP Auth API');
    });
  }

  private initMiddleware(): void {
    this.express.use(cors());
    this.express.use(helmet());
    // this.express.use(compression());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));

    logger.info('Middleware (cors, helmet, express) initialized');
  }

  private initErrorMiddleware(): void {
    logger.info('Error middleware initialized');
    this.express.use(ErrorMiddleware);
  }

  private initLoggerMiddleware(): void {
    logger.info(`Logger middleware initialized`);
    this.express.use(LoggerMiddleware);
  }

  private initControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      logger.info(`${controller.constructor.name} initialized`);
      this.express.use('/api/', controller.router);
    });
  }

  private initSwagger(): void {
    this.express.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  }

  private async initDbConnection(): Promise<void> {
    const dbUrl = this.config.get<string>('dbUrl');

    await mongoose
      .connect(dbUrl)
      .then(() => logger.info('Connected to database'));
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      logger.info(`App listening on port ${this.port}`);
    });
  }

  /* For testing */
  /* public getApp(): Application {
    return this.express;
  } */
}
