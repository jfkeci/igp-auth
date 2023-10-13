import Notification from '../notifications/interfaces/notification.interface';
import { NotificationService } from '../notifications/notifications.service';

export class UserNotificationService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    const notifications = await this.notificationService._find({ userId });

    return notifications ?? [];
  }
}
