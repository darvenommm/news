import { isEmail } from 'validator';
import { HttpMethod, HttpStatus } from 'http-enums';
import { default as ms } from 'ms';

import { Controller } from '@/base/controller';
import { HttpError } from '@/base/errors';
import { AUTH_SERVICE, type IAuthService } from './service';
import { SIGN_UP_VALIDATOR } from './validators/signUp';
import { SIGN_IN_VALIDATOR } from './validators/signIn';
import { getUniqueId } from '@/helpers';

import type { Request, Response } from 'express';
import type { Validator } from '@/base/validator';
import type { Errors } from '@/base/errors';
import type { SignInDTO, SignUpDTO } from './dtos';
import type { IContainer } from '@/container';

export const AUTH_CONTROLLER = getUniqueId();

export class AuthController extends Controller {
  protected prefix = '/auth';

  private readonly authService: IAuthService;
  private readonly signUpValidator: Validator;
  private readonly signInValidator: Validator;

  public constructor(container: IContainer) {
    super();

    this.authService = container[AUTH_SERVICE] as IAuthService;
    this.signUpValidator = container[SIGN_UP_VALIDATOR] as Validator;
    this.signInValidator = container[SIGN_IN_VALIDATOR] as Validator;
  }

  protected setUpRouter(): void {
    this.addRoute({
      method: HttpMethod.POST,
      path: '/sign-up',
      handler: this.signUp,
      handlerThis: this,
      middlewares: this.signUpValidator.getValidationChain(),
    });

    this.addRoute({
      method: HttpMethod.POST,
      path: '/sign-in',
      handler: this.signIn,
      handlerThis: this,
      middlewares: this.signInValidator.getValidationChain(),
    });

    this.addRoute({
      method: HttpMethod.POST,
      path: '/sign-out',
      handler: this.signOut,
      handlerThis: this,
    });
  }

  private async signUp(request: Request, response: Response<void>): Promise<void> {
    const payload = request.payload as SignUpDTO;
    const [existedByEmail, existedByUsername] = await Promise.all([
      this.authService.getUserByEmail(payload.email),
      this.authService.getUserByUsername(payload.username),
    ]);

    if (Boolean(existedByEmail) || Boolean(existedByUsername)) {
      const errors: Errors = ['Email or username is busy with someone'];

      throw new HttpError('User is existed in the system', HttpStatus.UNPROCESSABLE_ENTITY, errors);
    }

    const { session } = await this.authService.addUser(payload);
    this.setSessionIntoCookies(response, session);

    response.status(HttpStatus.CREATED).end();
  }

  private async signIn(request: Request, response: Response<void>): Promise<void> {
    const { emailOrUsername, password } = request.payload as SignInDTO;

    const user = await (isEmail(emailOrUsername)
      ? this.authService.getUserByEmail(emailOrUsername)
      : this.authService.getUserByUsername(emailOrUsername));

    if (!user) {
      const errors: Errors = ['Email or username is not busy with someone'];

      throw new HttpError(
        'User is not existed in the system',
        HttpStatus.UNPROCESSABLE_ENTITY,
        errors,
      );
    }

    if (!(await this.authService.checkUserPassword(user.id, password))) {
      const errors: Errors = ['Incorrect password'];

      throw new HttpError(
        `Incorrect password from user ${user.email} ${user.username}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
        errors,
      );
    }

    this.setSessionIntoCookies(response, user.session);

    response.status(HttpStatus.NO_CONTENT).end();
  }

  private async signOut(_: Request, response: Response<void>): Promise<void> {
    response.clearCookie('session');

    response.status(HttpStatus.NO_CONTENT).end();
  }

  private setSessionIntoCookies(response: Response, session: string): void {
    response.cookie('session', session, {
      httpOnly: true,
      signed: true,
      priority: 'high',
      maxAge: ms('2 weeks'),
    });
  }
}
