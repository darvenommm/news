import { HttpMethod, HttpStatus } from 'http-enums';

import { Controller } from '@/base/controller';
import { getUniqueId } from '@/helpers';
import { HttpError, InternalServerError } from '@/base/errors';

import { NEWS_SERVICE, type INewsService, type PagesPaginationResult } from './service';
import { IS_AUTHENTICATED_GUARD, type IsAuthenticatedGuard, type IUser } from '../auth';
import { ADD_VALIDATOR } from './validators/add';
import { UPDATE_VALIDATOR } from './validators/update';
import { PAGES_PAGINATION_VALIDATOR } from './validators/pagesPagination';
import { CREATOR_OR_ADMIN_GUARD } from './guard/creatorOrAdmin';

import type { Request, Response } from 'express';
import type { IContainer } from '@/container';
import type { INew, INewRenderData } from './types';
import type { PagesPaginationDTO } from './dtos';
import type { AddDTO, UpdateDTO } from './dtos';
import type { Validator } from '@/base/validator';
import type { Guard } from '@/base/guard';

export const NEWS_CONTROLLER = getUniqueId();

interface GetOneResult {
  readonly new: INewRenderData;
}

interface Params {
  readonly slug: string;
}

export class NewsController extends Controller {
  protected prefix = '/news';

  private readonly newsService: INewsService;
  private readonly addValidator: Validator;
  private readonly updateValidator: Validator;
  private readonly pagesPaginationValidator: Validator;
  private readonly creatorOrAdminGuard: Guard;

  public constructor(container: IContainer) {
    super();
    this.newsService = container[NEWS_SERVICE] as INewsService;

    this.addValidator = container[ADD_VALIDATOR] as Validator;
    this.updateValidator = container[UPDATE_VALIDATOR] as Validator;
    this.pagesPaginationValidator = container[PAGES_PAGINATION_VALIDATOR] as Validator;
    this.creatorOrAdminGuard = container[CREATOR_OR_ADMIN_GUARD] as Guard;

    const isAuthenticatedGuard = container[IS_AUTHENTICATED_GUARD] as IsAuthenticatedGuard;
    this.outerMiddlewares.push(isAuthenticatedGuard.getGuard());
  }

  protected setUpRouter(): void {
    this.addRoute({
      method: HttpMethod.GET,
      path: '',
      handler: this.getByPagination,
      handlerThis: this,
      middlewares: this.pagesPaginationValidator.getValidationChain(),
    });

    this.addRoute({
      method: HttpMethod.GET,
      path: '/:slug',
      handler: this.getOne,
      handlerThis: this,
    });

    this.addRoute({
      method: HttpMethod.POST,
      path: '',
      handler: this.add,
      handlerThis: this,
      middlewares: this.addValidator.getValidationChain(),
    });

    this.addRoute({
      method: HttpMethod.PUT,
      path: '/:slug',
      handler: this.update,
      handlerThis: this,
      middlewares: [
        this.creatorOrAdminGuard.getGuard(),
        ...this.updateValidator.getValidationChain(),
      ],
    });

    this.addRoute({
      method: HttpMethod.DELETE,
      path: '/:slug',
      handler: this.remove,
      handlerThis: this,
      middlewares: [this.creatorOrAdminGuard.getGuard()],
    });
  }

  private async getOne(request: Request<Params>, response: Response<GetOneResult>): Promise<void> {
    const { slug } = request.params;
    const user = this.getCurrentUser(request);
    const newData = await this.newsService.getNewBySlugAndCheckExisting(slug);

    response.status(HttpStatus.OK).json({ new: { ...newData, creatorUsername: user.username } });
  }

  private async getByPagination(
    request: Request,
    response: Response<PagesPaginationResult>,
  ): Promise<void> {
    const payload = request.payload as PagesPaginationDTO;
    const responseData = await this.newsService.getNewsByPagesPagination(payload);

    response.status(HttpStatus.OK).json(responseData);
  }

  private async add(request: Request, response: Response<void>): Promise<void> {
    const payload = request.payload as AddDTO;
    const user = this.getCurrentUser(request);

    await this.newsService.addNew({ ...payload, creatorId: user.id });

    response.status(HttpStatus.CREATED).end();
  }

  private async update(request: Request<Params>, response: Response<void>): Promise<void> {
    const payload = request.payload as UpdateDTO;
    await this.newsService.fullUpdateNewBySlug(request.params.slug, payload);

    response.status(HttpStatus.NO_CONTENT).end();
  }

  private async remove(request: Request<Params>, response: Response<void>): Promise<void> {
    await this.newsService.removeNewBySlug(request.params.slug);

    response.status(HttpStatus.NO_CONTENT).end();
  }

  private getCurrentUser(request: Request<unknown>): IUser {
    return request.user!;
  }
}
