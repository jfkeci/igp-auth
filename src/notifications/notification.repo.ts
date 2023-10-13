import {
  ObjectId,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  ProjectionType,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import NotificationSchema from './notification.schema';
import Notification from './interfaces/notification.interface';

export class NotificationRepo {
  private notification = NotificationSchema;

  async _find(
    filter?: FilterQuery<Notification>,
    projection?: ProjectionType<Notification> | null,
    options?: QueryOptions<Notification> | null,
  ): Promise<Notification[]> {
    return await this.notification.find(filter ?? {}, projection, options);
  }

  async _findById(
    id: string | ObjectId,
    projection?: ProjectionType<Notification> | null,
    options?: QueryOptions<Notification> | null,
  ) {
    return await this.notification.findById(id, projection, options);
  }

  async _findOne(
    filter?: FilterQuery<Notification>,
    projection?: ProjectionType<Notification> | null,
    options?: QueryOptions<Notification> | null,
  ) {
    return await this.notification.findOne(filter, projection, options);
  }

  async _updateOne(
    filter?: FilterQuery<Notification>,
    update?: UpdateQuery<Notification> | UpdateWithAggregationPipeline,
    options?: QueryOptions<Notification> | null,
  ) {
    return await this.notification.updateOne(filter, update, options);
  }

  async _findByIdAndUpdate(
    id?: ObjectId | string,
    update?: UpdateQuery<Notification>,
    options?: QueryOptions<Notification> | null,
  ): Promise<Notification | null> {
    return await this.notification.findByIdAndUpdate(id, update, options);
  }

  async _findByIdAndDelete(
    id?: ObjectId | string,
    options?: QueryOptions<Notification> | null,
  ): Promise<Notification | null> {
    return await this.notification.findByIdAndDelete(id, options);
  }

  async _deleteMany(query: FilterQuery<Notification>): Promise<number> {
    const result = await this.notification.deleteMany(query).exec();

    return result.deletedCount || 0;
  }

  async _updateMany(
    query: FilterQuery<Notification>,
    updateData: UpdateQuery<Notification>,
  ): Promise<number> {
    const result = await this.notification.updateMany(query, updateData).exec();

    return result.modifiedCount || 0;
  }

  async _createOne(data: Partial<Notification>): Promise<Notification> {
    const notification = new this.notification(data);

    return await notification.save();
  }
}
