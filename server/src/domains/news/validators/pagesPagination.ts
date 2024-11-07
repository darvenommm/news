import { checkSchema } from 'express-validator';

import { Validator } from '@/base/validator';
import { getUniqueId } from '@/helpers';

import type { ValidationChain } from 'express-validator';

export const PAGES_PAGINATION_VALIDATOR = getUniqueId();

export class pagesPaginationValidator extends Validator {
  protected getValidators(): Iterable<ValidationChain> {
    return checkSchema({
      page: {
        trim: true,
        default: {
          options: 1,
        },
        isInt: {
          options: {
            min: 1,
          },
          errorMessage: 'The page should be an integer number',
        },
        toInt: true,
      },
      limit: {
        trim: true,
        default: {
          options: 10,
        },
        isInt: {
          options: {
            gt: 0,
          },
          errorMessage: 'The limit should be an integer number',
        },
        toInt: true,
      },
    });
  }
}
