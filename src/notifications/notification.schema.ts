import { Schema, model } from 'mongoose';
import Notification from './interfaces/notification.interface';

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Notification ID.
 *           example: 62124b4fbed6940f1b55d992
 *         title:
 *           type: string
 *           description: Notification Title.
 *           example: This is the notification title
 *         Body:
 *           type: string
 *           description: Notification body
 *           example: This is the notification body.
 *         createdAt:
 *           type: string
 *           description: Date and time when the notification was created
 *           example: 2022-02-20T13:51:31.537+00:00
 *         updatedAt:
 *           type: string
 *           description: Date and time when the notification was updated
 *           example: 2022-02-20T13:51:31.537+00:00
 */

const NotificationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export default model<Notification>('Notification', NotificationSchema);
