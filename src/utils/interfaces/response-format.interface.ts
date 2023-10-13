import { HttpStatus } from '../enums/http-status.enum';
import { ResponseType } from '../enums/response-type.enum';

export interface ResponseFormat<T> {
  type: ResponseType;
  status: HttpStatus;
  data: T;
}
