import { HttpStatus } from 'http-enums';

import { Guard } from '@/base/guard';
import { HttpError } from '@/base/errors';
import { AUTH_SERVICE, type IAuthService } from '../service';
import { getUniqueId } from '@/helpers';

import type { Request } from 'express';
import type { Errors } from '@/base/errors';
import type { IContainer } from '@/container';

export const IS_AUTHENTICATED_GUARD = getUniqueId();

export class IsAuthenticatedGuard extends Guard<never> {
  private readonly authService: IAuthService;

  public constructor(container: IContainer) {
    super();

    this.authService = container[AUTH_SERVICE] as IAuthService;
  }

  protected async check(request: Request): Promise<boolean> {
    const session: string | null = request.signedCookies.session ?? null;

    if (!session || !(await this.authService.getUserBySession(session))) {
      const errors: Errors = ['You are not authenticated'];

      throw new HttpError('User is not authenticated', HttpStatus.UNAUTHORIZED, errors);
    }

    return true;
  }
}
