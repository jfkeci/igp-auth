import { NotificationRepo } from './notification.repo';
import Notification from './interfaces/notification.interface';
import { FilterQuery, QueryOptions, ProjectionType } from 'mongoose';

export class NotificationService {
  private notificationRepo = new NotificationRepo();

  async _find(
    filter?: FilterQuery<Notification>,
    projection?: ProjectionType<Notification> | null,
    options?: QueryOptions<Notification> | null,
  ): Promise<Notification[]> {
    return await this.notificationRepo._find(filter ?? {}, projection, options);
  }
}
