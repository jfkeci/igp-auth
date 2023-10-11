import jwt from 'jsonwebtoken';

export interface JwtPayload extends jwt.JwtPayload {
  id: string;
}
