import { HttpStatus } from 'http-enums';

import { Guard } from '@/base/guard';
import { HttpError } from '@/base/errors';
import { AUTH_SERVICE, type IAuthService } from '../service';
import { getUniqueId } from '@/helpers';

import type { Request, Response } from 'express';
import type { Errors } from '@/base/errors';
import type { Role } from '../types';
import type { IContainer } from '@/container';

export const IS_HAS_PERMISSION_GUARD = getUniqueId();

export class IsHasPermissionGuard<T extends Role[] = Role[]> extends Guard<T> {
  private readonly authService: IAuthService;

  public constructor(container: IContainer) {
    super();

    this.authService = container[AUTH_SERVICE] as IAuthService;
  }

  protected async check(request: Request, _: Response, roles: T): Promise<boolean> {
    const errorMessage = 'User is not authenticated';
    const errors: Errors = ['You are not authenticated'];
    const session: string | null = request.signedCookies.session ?? null;

    if (!session) {
      throw new HttpError(errorMessage, HttpStatus.UNAUTHORIZED, errors);
    }

    const user = await this.authService.getUserBySession(session);

    if (!user) {
      throw new HttpError(errorMessage, HttpStatus.UNAUTHORIZED, errors);
    }

    if (!roles.includes(user.role)) {
      return false;
    }

    return true;
  }
}
