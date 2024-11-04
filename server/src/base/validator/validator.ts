import { validationResult, matchedData } from 'express-validator';
import { HttpStatus } from 'http-enums';

import { HttpError } from '../errors';

import type { Request, Response, NextFunction } from 'express';
import type { ValidationChain } from 'express-validator';
import type { Middleware } from '@/types';

export abstract class Validator {
  public getValidationChain(): Iterable<Middleware> {
    return [...this.getValidators(), this.validateRequest];
  }

  protected abstract getValidators(): Iterable<ValidationChain>;

  private validateRequest(request: Request, _: Response, next: NextFunction): void {
    const result = validationResult(request);

    if (result.isEmpty()) {
      request.payload = matchedData(request);

      return next();
    }

    next(
      new HttpError(
        'Incorrect data in validators',
        HttpStatus.UNPROCESSABLE_ENTITY,
        result.array(),
      ),
    );
  }
}
