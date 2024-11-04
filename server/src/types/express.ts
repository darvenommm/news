import type { Request, Response, NextFunction } from 'express';

export type Handler = (request: Request, Response: Response) => void | Promise<void>;
export type Middleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => void | Promise<void>;
