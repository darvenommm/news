import { checkSchema } from 'express-validator';

import { Validator } from '@/base/validator';
import { USERNAME_CONSTRAINTS, PASSWORD_CONSTRAINTS } from '../constraints';
import { getUniqueId } from '@/helpers';

import type { ValidationChain } from 'express-validator';

export const SIGN_UP_VALIDATOR = getUniqueId();

export class SignUpValidator extends Validator {
  protected getValidators(): ValidationChain[] {
    return checkSchema({
      email: {
        trim: true,
        escape: true,
        notEmpty: {
          errorMessage: 'Email cannot be empty',
        },
        isEmail: {
          errorMessage: 'Invalid email format',
        },
        normalizeEmail: true,
      },
      username: {
        trim: true,
        escape: true,
        notEmpty: {
          errorMessage: 'Username cannot be empty',
        },
        isLength: {
          options: { min: USERNAME_CONSTRAINTS.minLength, max: USERNAME_CONSTRAINTS.maxLength },
          errorMessage: `Username must be between ${USERNAME_CONSTRAINTS.minLength} and ${USERNAME_CONSTRAINTS.maxLength} characters long`,
        },
        matches: {
          options: USERNAME_CONSTRAINTS.getPattern(),
          errorMessage: `User format should be like ${USERNAME_CONSTRAINTS.getBeautifulPatternView()}`,
        },
      },
      password: {
        trim: true,
        notEmpty: {
          errorMessage: 'Password cannot be empty',
        },
        isLength: {
          options: { min: PASSWORD_CONSTRAINTS.minLength, max: PASSWORD_CONSTRAINTS.maxLength },
          errorMessage: `Password must be between ${PASSWORD_CONSTRAINTS.minLength} and ${PASSWORD_CONSTRAINTS.maxLength} characters long`,
        },
      },
    });
  }
}