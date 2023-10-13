import { Request, Response, Router } from 'express';
import { HttpStatus } from '../utils/enums/http-status.enum';
import { ResponseType } from '../utils/enums/response-type.enum';
import { UserNotificationRoutes } from './user-notifications.rotues';
import { UserNotificationService } from './user-notifications.service';
import { ResponseFormat } from '../utils/interfaces/response-format.interface';
import Notification from '../notifications/interfaces/notification.interface';

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
      data: result,
    };

    return res.status(HttpStatus.OK).json(response);
  }
}
