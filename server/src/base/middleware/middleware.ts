import type { Middleware as MiddlewareType } from '@/types';

export abstract class Middleware {
  public abstract getMiddleware(): MiddlewareType;
}
