import { UserRepo } from './user.repo';
import User from './interfaces/user.interface';
import { HttpStatus } from '../utils/enums/http-status.enum';
import { HttpException } from '../utils/classes/http-exception.class';
import { CreateUserParams } from './interfaces/create-user-params.interface';
import { ObjectId, FilterQuery, QueryOptions, ProjectionType } from 'mongoose';

export class UserService {
  private usersRepo = new UserRepo();

  async createOne(data: CreateUserParams): Promise<User> {
    let user: User;

    try {
      user = await this.usersRepo._createOne(data);
    } catch (error) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        `Failed creating user|${error}`,
      );
    }

    if (!user) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Failed creating user');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepo._findOne({ email });

    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'User not found');
    }

    return user.toObject();
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepo._findOne({ username });

    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'User not found');
    }

    return user.toObject();
  }

  async _findOne(
    filter?: FilterQuery<User>,
    projection?: ProjectionType<User> | null,
    options?: QueryOptions<User> | null,
  ) {
    return await this.usersRepo._findOne(filter, projection, options);
  }

  async _findById(
    id: string | ObjectId,
    projection?: ProjectionType<User> | null,
    options?: QueryOptions<User> | null,
  ) {
    return await this.usersRepo._findById(id, projection, options);
  }

  async _find(
    filter?: FilterQuery<User>,
    projection?: ProjectionType<User> | null,
    options?: QueryOptions<User> | null,
  ): Promise<User[]> {
    return await this.usersRepo._find(filter ?? {}, projection, options);
  }
}
