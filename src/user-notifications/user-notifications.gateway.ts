import { logger } from '../utils/logger';
import { Server, Socket } from 'socket.io';
import { JwtService } from '../utils/services/jwt.service';
import Notification from '../notifications/interfaces/notification.interface';
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
    next: (err?: Error) => void,
  ): void {
    const token = socket.handshake.query.token as string;

    if (!token) return next(new Error('Authentication error'));

    const userId = this.jwtService.verify(token);

    console.log('websocket middleware userId', userId);

    if (!userId) return next(new Error('Unauthorized'));

    socket.userId = userId;
  }

  private onConnection(socket: ExtendedSocket): void {
    logger.info(`User ${socket.userId} connected to socket ${socket.id}`);

    socket.on('create-notification', (data: CreateUserNotificationParams) => {
      const { error } = createNotificationValidationSchema.validate(data);

      if (socket.userId !== data.userId) {
        socket.emit('authorization-error', 'Forbidden');
        return;
      }

      if (error) {
        socket.emit('validation-error', error.details[0].message);
      } else {
        this.userNotificationService.createUserNotification(data);
      }
    });
  }

  public emitNotification(userId: string, notification: Notification): void {
    const sockets = Object.values(this.io.sockets.sockets).filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (socket: any) => socket.userId === userId,
    );

    sockets.forEach((socket) => socket.emit('new-notification', notification));
  }
}
