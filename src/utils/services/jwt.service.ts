import jwt, { JwtPayload } from 'jsonwebtoken';
import { ConfigService } from '../config/env.config';
import { HttpException } from '../classes/http-exception.class';
import { HttpStatus } from '../enums/http-status.enum';

export interface GenUserTokenParams {
  id: string;
  secret?: string;
  expiry?: string;
}

export class JwtService {
  private secret: string;
  private expiry: number;
  private config: ConfigService;

  constructor() {
    this.config = new ConfigService();

    this.secret = this.config.get<string>('jwtSecret');
    this.expiry = this.config.get<number>('jwtExpiry');
  }

  generateToken(data: GenUserTokenParams): string {
    return jwt.sign({ id: data.id } as JwtPayload, data.secret ?? this.secret, {
      expiresIn: data.expiry ?? `${this.expiry}d`
    });
  }

  private decode(token: string): string | undefined {
    if (token) {
      try {
        const decoded = jwt.decode(token) as JwtPayload;

        if (decoded) return decoded.id;

        return undefined;
      } catch (error) {
        throw new HttpException(
          HttpStatus.UNAUTHORIZED,
          `Unauthorized|Failed parsing jwt|${error}`
        );
      }
    }

    return undefined;
  }

  verify(token: string): string | undefined {
    try {
      const payload = jwt.verify(token, this.secret) as JwtPayload;

      if (payload) return payload.id as string;

      return undefined;
    } catch (error) {
      throw new HttpException(
        HttpStatus.UNAUTHORIZED,
        `Unauthorized|Failed parsing jwt|${error}`
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTokenFromHeaders(req: any): string | null {
    let token: string;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      return null;
    }

    if (token) return token;

    return null;
  }

  getUserIdFromAuthHeaders(req: Request): string | undefined {
    const token = this.getTokenFromHeaders(req);

    if (token) return this.verify(token);

    return undefined;
  }
}
