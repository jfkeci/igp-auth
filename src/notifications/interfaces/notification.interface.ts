import mongoose, { Document } from 'mongoose';

export default interface Notification extends Document {
  _id: string;
  title: string;
  body?: string | null;
  userId: string;

  createdAt: mongoose.Date;
  updatedAt: mongoose.Date;
}
