import { HttpStatus } from 'http-enums';

import { getUniqueId } from '@/helpers';
import { HttpError, InternalServerError } from '@/base/errors';
import { NEWS_REPOSITORY } from './repository';
import { AUTH_SERVICE, type IAuthService } from '../auth';

import type { UpdateDTO } from './dtos';
import type { INew, INewRenderData } from './types';
import type { AddData, INewsRepository } from './repository';
import type { PagesPaginationDTO } from './dtos';
import type { IContainer } from '@/container';
import type { IUser } from '../auth';

export const NEWS_SERVICE = getUniqueId();

export interface PagesPaginationResult {
  readonly news: INewRenderData[];
  readonly pagesCount: number;
}

export interface INewsService {
  getNewBySlugAndCheckExisting: (slug: string) => never | Promise<INew>;

  getNewsByPagesPagination: (
    paginationSettings: PagesPaginationDTO,
  ) => Promise<PagesPaginationResult>;

  addNew: (addData: AddData) => Promise<void>;
  fullUpdateNewBySlug: (slug: string, updateData: UpdateDTO) => Promise<void>;
  removeNewBySlug: (slug: string) => Promise<void>;
}

export class NewsService implements INewsService {
  private readonly newsRepository: INewsRepository;
  private readonly authService: IAuthService;

  public constructor(container: IContainer) {
    this.authService = container[AUTH_SERVICE] as IAuthService;
    this.newsRepository = container[NEWS_REPOSITORY] as INewsRepository;
  }

  public async getNewBySlugAndCheckExisting(slug: string): never | Promise<INew> {
    const newData = await this.newsRepository.getNewByField('slug', slug);

    if (!newData) {
      throw new HttpError('Incorrect slug', HttpStatus.UNPROCESSABLE_ENTITY, [
        'A new with this slug is not existed',
      ]);
    }

    return newData;
  }

  public async getNewsByPagesPagination(
    paginationSettings: PagesPaginationDTO,
  ): Promise<PagesPaginationResult> {
    const { limit } = paginationSettings;

    const [newsCount, rawNews] = await Promise.all([
      this.newsRepository.getNewsCount(),
      this.newsRepository.getNewsByPages(paginationSettings),
    ]);

    const newsWithCreatorData = await Promise.all(
      rawNews.map(async (rawNew): Promise<INewRenderData> => {
        const user = await this.authService.getUserById(rawNew.creatorId);
        if (!user) throw new InternalServerError('Incorrect user id');

        return { ...rawNew, creatorUsername: user.username };
      }),
    );

    return { news: newsWithCreatorData, pagesCount: Math.ceil(newsCount / limit) };
  }

  public async addNew(addData: AddData): Promise<void> {
    if (await this.newsRepository.getNewByField('id', addData.id)) {
      return;
    }

    await this.checkNotExistingNewWithThisTitle(addData.title);

    return this.newsRepository.addNew(addData);
  }

  public async fullUpdateNewBySlug(slug: string, updateData: UpdateDTO): Promise<void> {
    const newData = await this.getNewBySlugAndCheckExisting(slug);
    await this.checkNotExistingNewWithThisTitle(updateData.title);

    return this.newsRepository.fullUpdateNewById(newData.id, updateData);
  }

  public async removeNewBySlug(slug: string): Promise<void> {
    const newData = await this.getNewBySlugAndCheckExisting(slug);

    return this.newsRepository.removeNewById(newData.id);
  }

  private async checkNotExistingNewWithThisTitle(title: string): Promise<never | void> {
    if (await this.newsRepository.getNewByField('title', title)) {
      throw new HttpError('Repeated title', HttpStatus.UNPROCESSABLE_ENTITY, [
        'There is a new with this title already',
      ]);
    }
  }
}
