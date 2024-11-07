import { checkSchema } from 'express-validator';
import { isEmail } from 'validator';

import { Validator } from '@/base/validator';
import { USERNAME_CONSTRAINTS, PASSWORD_CONSTRAINTS } from '../constraints';
import { getUniqueId } from '@/helpers';

import type { ValidationChain } from 'express-validator';

export const SIGN_IN_VALIDATOR = getUniqueId();

export class SignInValidator extends Validator {
  protected getValidators(): Iterable<ValidationChain> {
    return checkSchema({
      emailOrUsername: {
        trim: true,
        notEmpty: {
          errorMessage: 'The username or Email cannot be empty',
        },
        customSanitizer: {
          options: (value: string): string => {
            return isEmail(value) ? value.toLowerCase() : value;
          },
        },
        custom: {
          options: (value: string): boolean => {
            if (isEmail(value)) {
              return true;
            }

            const { minLength, maxLength } = USERNAME_CONSTRAINTS;
            if (!(minLength <= value.length && value.length <= maxLength)) {
              throw new Error(
                `The username must be between ${minLength} and ${maxLength} characters long`,
              );
            }

            if (!USERNAME_CONSTRAINTS.getPattern().test(value)) {
              throw new Error(
                `The username format should be like ${USERNAME_CONSTRAINTS.getBeautifulPatternView()}`,
              );
            }

            return true;
          },
        },
      },
      password: {
        trim: true,
        notEmpty: {
          errorMessage: 'The password cannot be empty',
        },
        isLength: {
          options: { min: PASSWORD_CONSTRAINTS.minLength, max: PASSWORD_CONSTRAINTS.maxLength },
          errorMessage: `The password must be between ${PASSWORD_CONSTRAINTS.minLength} and ${PASSWORD_CONSTRAINTS.maxLength} characters long`,
        },
      },
    });
  }
}
