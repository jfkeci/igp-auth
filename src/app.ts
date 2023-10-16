import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import compression from 'compression';
import { logger } from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';
import express, { Application } from 'express';
import { Server as IOServer } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import { ConfigService } from './utils/config/env.config';
import { swaggerDocs } from './utils/config/swagger.config';
import Controller from './utils/interfaces/controller.interface';
import { ErrorMiddleware } from './utils/middlewares/error.middleware';
import { rateLimiterConfig } from './utils/config/rate-limiter.config';
import { LoggerMiddleware } from './utils/middlewares/logger.middleware';
import { UserNotificationsGateway } from './user-notifications/user-notifications.gateway';

export class App {
  private config: ConfigService;

  public port: number;
  public io: IOServer;
  public express: Application;
  public httpServer: HttpServer;

  constructor(controllers: Controller[], port: number) {
    logger.info(`Starting the app...`);

    this.config = new ConfigService();

    this.express = express();
    this.port = port;

    this.initSwagger();

    this.initMiddleware();

    this.initErrorMiddleware();
    this.initLoggerMiddleware();

    this.initDbConnection();

    this.initControllers(controllers);

    this.express.use('/api', (req, res) => {
      res.send('Welcome to iGP Auth API');
    });

    this.express.use('/', (req, res) => {
      res.send('Welcome to iGP Auth API');
    });

    this.httpServer = createServer(this.express);

    this.io = new IOServer(this.httpServer, {
      cors: { origin: '*' }
    });

    this.initGateways(this.io);
  }

  private initMiddleware(): void {
    this.express.use(cors());
    this.express.use(helmet());
    this.express.use(compression());
    this.express.use(express.json());
    this.express.use(rateLimit(rateLimiterConfig()));
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
    const apiPrefix = this.config.get<string>('prefix');

    controllers.forEach((controller: Controller) => {
      this.express.use(`/${apiPrefix}`, controller.router);

      logger.info(`${controller.constructor.name} initialized`);
    });
  }

  private initGateways(io: IOServer): void {
    new UserNotificationsGateway(io);
  }

  private initSwagger(): void {
    this.express.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  }

  private async initDbConnection(): Promise<void> {
    const dbUrl = this.config.get<string>('dbUrl');

    try {
      await mongoose
        .connect(dbUrl)
        .then(() => logger.info('Connected to database'));
    } catch (error) {
      throw new Error(`Database connection failed|${error}`);
    }
  }

  public listen(): void {
    this.httpServer.listen(this.port, () => {
      logger.info(`App listening on port ${this.port}`);
    });
  }

  /* For testing */
  /* public getApp(): Application {
    return this.express;
  } */
}
