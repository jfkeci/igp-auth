import { logger } from '../utils/logger';
import { Server, Socket } from 'socket.io';
import { JwtService } from '../utils/services/jwt.service';
import { HttpStatus } from '../utils/enums/http-status.enum';
import { HttpException } from '../utils/classes/http-exception.class';
import { UserNotificationService } from './user-notifications.service';
import { CreateUserNotificationParams } from './interface/create-user-notification-params.interface';
import { createNotificationValidationSchema } from './user-notifications.validation';

interface ExtendedSocket extends Socket {
  userId?: string;
}

export class UserNotificationsGateway {
  private io: Server;

  private jwtService: JwtService;
  private userNotificationService: UserNotificationService;

  constructor(io: Server) {
    this.jwtService = new JwtService();
    this.userNotificationService = new UserNotificationService();

    this.io = io;

    this.io.use(this.middleware.bind(this)); // Middleware for authentication

    this.io.on('connection', this.onConnection.bind(this));

    logger.info('UserNotificationsGateway initialized');
  }

  private middleware(
    socket: ExtendedSocket,
    next: (err?: Error) => void
  ): void {
    const token = socket.handshake.query.token as string;

    if (!token) {
      logger.error(`Websocket Auth Error: Token missing`);
      socket.emit('authentication-error', 'Token missing');
      return next(new HttpException(HttpStatus.UNAUTHORIZED, 'Token missing'));
    }

    let userId: string | undefined;

    try {
      userId = this.jwtService.verify(token);
    } catch (error) {
      logger.error(`Websocket Auth Error: Invalid token ${token}`);
      socket.emit('authentication-error', 'Invalid token');
      return next(new HttpException(HttpStatus.BAD_REQUEST, 'Invalid Token'));
    }

    if (!userId) {
      logger.error(`Websocket Auth Error: Invalid token ${token}`);
      socket.emit('authentication-error', 'Invalid token');
      return next(new HttpException(HttpStatus.BAD_REQUEST, 'Invalid Token'));
    }

    socket.userId = userId as string;

    next();
  }

  private onConnection(socket: ExtendedSocket): void {
    logger.info(`User ${socket.userId} connected to socket ${socket.id}`);

    socket.on(
      'create-notification',
      async (data: CreateUserNotificationParams) => {
        logger.debug(
          `Creating new notification: ${Object.values(data).join(', ')}`
        );

        if (socket.userId !== data.userId) {
          socket.emit('authorization-error', 'Forbidden');
          return;
        }

        const { error } = createNotificationValidationSchema.validate(data);

        if (error) {
          socket.emit('validation-error', error.details[0].message);
        } else {
          const newNotification =
            await this.userNotificationService.createUserNotification(data);

          socket.emit('new-notification', newNotification);
        }
      }
    );

    socket.on('disconnect', () => {
      logger.info(
        `User ${socket.userId} disconnected from socket ${socket.id}`
      );
    });
  }
}
