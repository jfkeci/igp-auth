import { Router } from 'express';
import { logger } from '../utils/logger';
import { ConfigService } from '../utils/config/env.config';
import { AuthMiddleware } from '../utils/middlewares/auth.middleware';
import { userIdParamValidationSchema } from '../users/user.validation';
import { UserNotificationsController } from './user-notifications.controller';
import { ValidationMiddleware } from '../utils/middlewares/validation.middleware';
import { createUserNotificationValidationSchema } from './user-notifications.validation';

export class UserNotificationRoutes {
  private router = Router();
  private path = '/users/:userId/notifications';

  private config = new ConfigService();

  public init(controller: UserNotificationsController): Router {
    const apiPrefix = this.config.get<string>('prefix');

    // [x] Get user notifications
    logger.info(
      `${controller.constructor.name} get ${apiPrefix}${this.path} route`
    );
    this.router.get(
      `${this.path}`,
      [
        AuthMiddleware(),
        ValidationMiddleware(userIdParamValidationSchema, 'params')
      ],
      controller.getUserNotifications.bind(controller)
    );

    // [x] Create user notifications
    logger.info(
      `${controller.constructor.name} POST ${apiPrefix}${this.path} route`
    );
    this.router.post(
      `${this.path}`,
      [
        AuthMiddleware(),
        ValidationMiddleware(userIdParamValidationSchema, 'params'),
        ValidationMiddleware(createUserNotificationValidationSchema)
      ],
      controller.createUserNotification.bind(controller)
    );

    return this.router;
  }
}

/**
 * @swagger
 * tags:
 *   name: User Notifications
 *   description: Endpoints for managing user notifications
 */

/**
 * @swagger
 * /api/users/{userId}/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [User Notifications]
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: User ID.
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 62124b4fbed6940f1b55d992
 *     responses:
 *       200:
 *         description: User notifications retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Unauthorized access.
 */

/**
 * @swagger
 * /api/users/{userId}/notifications:
 *   post:
 *     summary: Create user notification
 *     tags: [User Notifications]
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: User ID.
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 62124b4fbed6940f1b55d992
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Notification title.
 *                 example: New Message
 *               body:
 *                 type: string
 *                 description: Notification body.
 *                 example: You have a new message.
 *     responses:
 *       201:
 *         description: User notification created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Unauthorized access.
 *       400:
 *         description: Bad request, notification creation failed.
 */
