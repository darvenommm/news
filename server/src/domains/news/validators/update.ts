import { checkSchema } from 'express-validator';

import { Validator } from '@/base/validator';
import { TITLE_CONSTRAINTS, TEXT_CONSTRAINTS } from '../constraints';
import { getUniqueId } from '@/helpers';

import type { ValidationChain } from 'express-validator';

export const UPDATE_VALIDATOR = getUniqueId();

export class UpdateValidator extends Validator {
  protected getValidators(): Iterable<ValidationChain> {
    return checkSchema({
      title: {
        trim: true,
        escape: true,
        notEmpty: {
          errorMessage: 'The title cannot be empty',
        },
        isLength: {
          options: { min: TITLE_CONSTRAINTS.minLength, max: TITLE_CONSTRAINTS.maxLength },
          errorMessage: `The title must be between ${TITLE_CONSTRAINTS.minLength} and ${TITLE_CONSTRAINTS.maxLength} characters long`,
        },
      },
      text: {
        trim: true,
        escape: true,
        notEmpty: {
          errorMessage: 'The text cannot be empty',
        },
        isLength: {
          options: { min: 1, max: TEXT_CONSTRAINTS.maxLength },
          errorMessage: `The text must be between ${1} and ${
            TEXT_CONSTRAINTS.maxLength
          } characters long`,
        },
      },
    });
  }
}
