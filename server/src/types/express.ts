import type { Request, Response, NextFunction } from 'express';

export type Handler = (request: Request<any>, Response: Response) => void | Promise<void>;
export type Middleware = (
  request: Request<any>,
  response: Response,
  next: NextFunction,
) => void | Promise<void>;
