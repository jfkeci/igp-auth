import { HttpStatus } from '../enums/http-status.enum';

export class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(status: HttpStatus, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}
