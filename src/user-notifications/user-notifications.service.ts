import Notification from '../notifications/interfaces/notification.interface';
import { NotificationService } from '../notifications/notifications.service';
import { HttpException } from '../utils/classes/http-exception.class';
import { HttpStatus } from '../utils/enums/http-status.enum';
import { CreateUserNotificationParams } from './interface/create-user-notification-params.interface';

export class UserNotificationService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    const notifications = await this.notificationService._find({ userId });

    return notifications ?? [];
  }

  async createUserNotification(
    data: CreateUserNotificationParams,
  ): Promise<Notification> {
    let notification: Notification;

    try {
      notification = await this.notificationService._createOne(data);
    } catch (error) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        `Failed creating notification|${error}`,
      );
    }

    if (!notification) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Failed creating notification',
      );
    }

    return notification;
  }
}
