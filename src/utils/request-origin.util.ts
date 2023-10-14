import { Request } from 'express';

export const getRequestOrigin = (req: Request): string => {
  const url = new URL(req.url, `${req.protocol}://${req.headers.host}`);

  return url.origin;
};
