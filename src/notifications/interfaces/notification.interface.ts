import { Document } from 'mongoose';

export default interface Notification extends Document {
  _id: string;
  title: string;
  body?: string | null;
  userId: string;
  isArchived: boolean;
  isSeen: boolean;
}
