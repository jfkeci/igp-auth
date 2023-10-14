import { Schema, model } from 'mongoose';
import Notification from './interfaces/notification.interface';

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
