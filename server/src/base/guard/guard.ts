import { HttpStatus } from 'http-enums';

import { HttpError } from '../errors';

import type { Request, Response, NextFunction } from 'express';
import type { Middleware } from '@/types';
import type { Errors } from '../errors';

export abstract class Guard<T = unknown> {
  public getGuard(argument?: T): Middleware {
    return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      try {
        const isCorrectRequest = await this.check(request, response, argument);

        if (!isCorrectRequest) {
          const errors: Errors = ['You are forbidden'];

          throw new HttpError('User is forbidden in abstract base', HttpStatus.FORBIDDEN, errors);
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  protected abstract check(request: Request, response: Response, argument?: T): Promise<boolean>;
}
