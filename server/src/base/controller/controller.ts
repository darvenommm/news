import { Router } from 'express';
import { HttpMethod } from 'http-enums';

import type { NextFunction, Request, Response, IRouterMatcher, IRouter } from 'express';
import type { Handler, Middleware } from '@/types';

interface AddRouteOptions {
  method: HttpMethod;
  path: string;
  handler: Handler;
  handlerThis: unknown;
  middlewares?: Iterable<Middleware>;
}

export abstract class Controller {
  protected abstract prefix: string;
  protected outerMiddlewares: Middleware[] = [];
  protected innerMiddlewares: Middleware[] = [];

  private readonly _router: Router;

  public constructor() {
    this._router = Router();
  }

  public get router(): Router {
    this.setUpRouter(this._router);

    return this._router;
  }

  protected handleError(handler: Handler): Middleware {
    return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      try {
        await handler(request, response);
      } catch (error) {
        next(error);
      }
    };
  }

  protected abstract setUpRouter(router: Router): void;

  protected addRoute({ method, path, handler, handlerThis, middlewares }: AddRouteOptions): void {
    const routerMethods: Record<HttpMethod, IRouterMatcher<IRouter>> = {
      [HttpMethod.HEAD]: this._router.head,
      [HttpMethod.GET]: this._router.get,
      [HttpMethod.POST]: this._router.post,
      [HttpMethod.PUT]: this._router.put,
      [HttpMethod.PATCH]: this._router.patch,
      [HttpMethod.DELETE]: this._router.delete,
      [HttpMethod.OPTIONS]: this._router.options,
    };

    const needMethod = routerMethods[method].bind(this._router);
    needMethod(
      `${this.prefix}${path}`,
      ...this.outerMiddlewares,
      ...(middlewares ?? []),
      ...this.innerMiddlewares,
      this.handleError(handler.bind(handlerThis)),
    );
  }
}
