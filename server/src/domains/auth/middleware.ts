import { Middleware } from '@/base/middleware';

import { getUniqueId } from '@/helpers';
import { AUTH_SERVICE, type IAuthService } from './service';

import type { Middleware as MiddlewareType } from '@/types';
import type { Request, Response, NextFunction } from 'express';
import type { IContainer } from '@/container';

export const AUTH_MIDDLEWARE = getUniqueId();

export class AuthMiddleware extends Middleware {
  private readonly authService: IAuthService;

  public constructor(container: IContainer) {
    super();

    this.authService = container[AUTH_SERVICE] as IAuthService;
  }

  public get middleware(): MiddlewareType {
    return this.middlewareHandler.bind(this);
  }

  private async middlewareHandler(
    request: Request,
    _: Response,
    next: NextFunction,
  ): Promise<void> {
    const session = request.signedCookies.session;

    if (session) {
      request.user = await this.authService.getUserBySession(session);
    }

    next();
  }
}
