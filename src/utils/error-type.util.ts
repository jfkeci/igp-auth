import mongoose from 'mongoose';
import { ValidationError } from 'joi';
import { ErrorType } from './enums/error-type.enum';

export const determineErrorType = (
  error?:
    | Error
    | ValidationError
    | mongoose.Error.CastError
    | mongoose.Error.ValidationError
): ErrorType => {
  if (error instanceof mongoose.Error.ValidationError) {
    return ErrorType.MongooseValidationError;
  }

  if (error instanceof mongoose.Error.CastError) {
    return ErrorType.MongooseCastError;
  }

  if (error instanceof ValidationError) {
    return ErrorType.JoiValidationError;
  }

  return ErrorType.Error;
};
