import { UserRepo } from './user.repo';
import User from './interfaces/user.interface';
import { HttpStatus } from '../utils/enums/http-status.enum';
import { HttpException } from '../utils/classes/http-exception.class';
import { CreateUserParams } from './interfaces/create-user-params.interface';

export class UserService extends UserRepo {
  async createOne(data: CreateUserParams): Promise<User> {
    let user: User;

    try {
      user = await this._createOne(data);
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
    const user = await this._findOne({ email });

    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'User not found');
    }

    return user.toObject();
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this._findOne({ username });

    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'User not found');
    }

    return user.toObject();
  }
}
