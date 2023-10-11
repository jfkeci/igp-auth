import {
  Model,
  ObjectId,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  ProjectionType,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import UserSchema from './user.schema';
import User from './interfaces/user.interface';

export class UserRepo {
  private user = UserSchema;

  schemaInstance(): Model<User> {
    return this.user;
  }

  async _findById(
    id: string | ObjectId,
    projection?: ProjectionType<User> | null,
    options?: QueryOptions<User> | null,
  ) {
    return await this.user.findById(id, projection, options);
  }

  async _findOne(
    filter?: FilterQuery<User>,
    projection?: ProjectionType<User> | null,
    options?: QueryOptions<User> | null,
  ) {
    return await this.user.findOne(filter, projection, options);
  }

  async _updateOne(
    filter?: FilterQuery<User>,
    update?: UpdateQuery<User> | UpdateWithAggregationPipeline,
    options?: QueryOptions<User> | null,
  ) {
    return await this.user.updateOne(filter, update, options);
  }

  async _findByIdAndUpdate(
    id?: ObjectId | string,
    update?: UpdateQuery<User>,
    options?: QueryOptions<User> | null,
  ): Promise<User | null> {
    return await this.user.findByIdAndUpdate(id, update, options);
  }

  async _findByIdAndDelete(
    id?: ObjectId | string,
    options?: QueryOptions<User> | null,
  ): Promise<User | null> {
    return await this.user.findByIdAndDelete(id, options);
  }

  async _deleteMany(query: FilterQuery<User>): Promise<number> {
    const result = await this.user.deleteMany(query).exec();

    return result.deletedCount || 0;
  }

  async _updateMany(
    query: FilterQuery<User>,
    updateData: UpdateQuery<User>,
  ): Promise<number> {
    const result = await this.user.updateMany(query, updateData).exec();

    return result.modifiedCount || 0;
  }

  async _createOne(data: Partial<User>): Promise<User> {
    const user = new this.user(data);

    return await user.save();
  }
}
