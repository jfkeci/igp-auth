import jwt, { JwtPayload } from 'jsonwebtoken';
import { ConfigService } from '../config/env.config';
import { HttpException } from '../classes/http-exception.class';
import { HttpStatus } from '../enums/http-status.enum';

export interface GenUserTokenParams {
  userId: string;
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

  genUserToken(data: GenUserTokenParams): string {
    return jwt.sign(
      { id: data.userId } as JwtPayload,
      data.secret ?? this.secret,
      { expiresIn: data.expiry ?? `${this.expiry}d` },
    );
  }

  private decode(token: string): JwtPayload | undefined {
    if (token) {
      try {
        const decoded = jwt.decode(token) as JwtPayload;

        return decoded;
      } catch (error) {
        throw new HttpException(
          HttpStatus.UNAUTHORIZED,
          `Unauthorized|Failed parsing jwt|${error}`,
        );
      }
    }

    return undefined;
  }

  verify(token: string): JwtPayload | undefined {
    try {
      const { id } = jwt.verify(token, this.secret) as JwtPayload;

      return id;
    } catch (error) {
      throw new HttpException(
        HttpStatus.UNAUTHORIZED,
        `Unauthorized|Failed parsing jwt|${error}`,
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

  getRequestAuthTokenPayload(req: Request): JwtPayload | null {
    const token = this.getTokenFromHeaders(req);

    if (token) {
      const payload = this.decode(token);

      if (payload) return payload;
    }

    return null;
  }

  getUserIdFromAuthHeaders(req: Request): string | null {
    const token = this.getTokenFromHeaders(req);

    if (token) {
      const verified = this.verify(token);

      if (verified) return verified.id;
    }

    return null;
  }
}
