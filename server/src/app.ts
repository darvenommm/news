import { default as express } from 'express';
import { default as cors } from 'cors';
import { default as cookieParser } from 'cookie-parser';
import { default as helmet } from 'helmet';
import { HttpStatus } from 'http-enums';

import { InternalServerError, HttpError } from './base/errors';
import { AUTH_CONTROLLER } from './domains/auth/controller';
import { getUniqueId } from './helpers';
import { SERVER_SETTINGS, type IServerSettings } from './settings/server';
import { EXTRA_SETTINGS, type IExtraSettings } from './settings/extra';
import { NEWS_CONTROLLER } from './domains/news';
import { AUTH_MIDDLEWARE } from './domains/auth';

import type { Controller } from '@/base/controller';
import type { Errors } from './base/errors';
import type { Express, Request, Response, NextFunction } from 'express';
import type { IContainer } from './container';
import type { Middleware } from './base/middleware';

export const APPLICATION = getUniqueId();

export class Application {
  private readonly server: Express;

  private readonly controllers: Iterable<Controller>;
  private readonly serverSettings: IServerSettings;
  private readonly extraSettings: IExtraSettings;
  private readonly authMiddleware: Middleware;

  public constructor(container: IContainer) {
    this.serverSettings = container[SERVER_SETTINGS] as IServerSettings;
    this.extraSettings = container[EXTRA_SETTINGS] as IExtraSettings;
    this.authMiddleware = container[AUTH_MIDDLEWARE] as Middleware;

    const authController = container[AUTH_CONTROLLER] as Controller;
    const newsController = container[NEWS_CONTROLLER] as Controller;
    this.controllers = [authController, newsController];

    this.server = this.getSetServer();
  }

  public start(): void {
    try {
      const { port, host } = this.serverSettings;

      this.server.listen(port, host, (): void => {
        console.log(`The server was started on ${port} port`);
      });
    } catch (error) {
      console.error(`The server was closed because of ${error}`);
    }
  }

  private getSetServer(): Express {
    const server = express();

    server.use(helmet());
    server.use(cors());
    server.use(express.json());
    server.use(cookieParser(this.extraSettings.secret));
    server.use(this.authMiddleware.middleware);

    for (const controller of this.controllers) {
      server.use(controller.router);
    }

    server.use(this.errorsHandler.bind(this));

    return server;
  }

  private errorsHandler(
    error: unknown,
    _request: Request,
    response: Response<{ errors: Errors }>,
    _next: NextFunction,
  ): void {
    const InternalServerErrors = ['Some internal server error'];

    if (error instanceof InternalServerError) {
      console.error(error.message, error.stack);
      response.status(error.status).json({ errors: InternalServerErrors });
      return;
    }

    if (error instanceof HttpError) {
      console.error(error.message, error.stack);
      response.status(error.status).json({ errors: error.errors });
      return;
    }

    if (error instanceof Error) {
      console.error(error.message, error.stack);
    } else {
      console.error(error);
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ errors: InternalServerErrors });
  }
}
