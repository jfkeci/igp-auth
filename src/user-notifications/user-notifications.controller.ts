import { Request, Response, Router } from 'express';
import { HttpStatus } from '../utils/enums/http-status.enum';
import { ResponseType } from '../utils/enums/response-type.enum';
import { UserNotificationRoutes } from './user-notifications.routes';
import { UserNotificationService } from './user-notifications.service';
import Notification from '../notifications/interfaces/notification.interface';
import { ResponseFormat } from '../utils/interfaces/response-format.interface';

export class UserNotificationsController {
  public router = Router();

  private userNotificationService: UserNotificationService;

  constructor() {
    this.initRoutes();

    this.userNotificationService = new UserNotificationService();
  }

  private initRoutes(): void {
    this.router = new UserNotificationRoutes().init(this);
  }

  async getUserNotifications(req: Request, res: Response) {
    const { userId } = req.params;

    const result =
      await this.userNotificationService.getUserNotifications(userId);

    const response: ResponseFormat<Notification[]> = {
      status: HttpStatus.OK,
      type: ResponseType.Notification,
      data: result
    };

    return res.status(HttpStatus.OK).json(response);
  }

  async createUserNotification(req: Request, res: Response) {
    const { userId } = req.params;
    const { title, body } = req.body;

    const result = await this.userNotificationService.createUserNotification({
      userId,
      title,
      body
    });

    const response: ResponseFormat<Notification> = {
      status: HttpStatus.CREATED,
      type: ResponseType.Notification,
      data: result
    };

    res.status(HttpStatus.CREATED).json(response);
  }
}
