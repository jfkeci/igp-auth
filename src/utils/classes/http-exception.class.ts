import { ErrorType } from '../enums/error-type.enum';
import { HttpStatus } from '../enums/http-status.enum';

export class HttpException extends Error {
  public status: number;
  public message: string;

  public type?: ErrorType;

  constructor(status: HttpStatus, message: string, type?: ErrorType) {
    super(message);
    this.type = type;
    this.status = status;
    this.message = message;
  }
}
