import { default as createSlug } from 'slug';

import { getUniqueId } from '@/helpers';
import { DATABASE, type IDatabase } from '@/database';

import type { INew } from './types';
import type { AddDTO, UpdateDTO } from './dtos';
import type { IContainer } from '@/container';
import type { PagesPaginationDTO } from './dtos';
import { InternalServerError } from '@/base/errors';

export const NEWS_REPOSITORY = getUniqueId();

export interface AddData extends AddDTO {
  readonly creatorId: string;
}

export interface INewsRepository {
  getNewByField: (field: string, value: string) => Promise<INew | null>;
  getNewsCount: () => Promise<number>;
  getNewsByPages: (paginationSettings: PagesPaginationDTO) => Promise<INew[]>;
  addNew: (newData: AddData) => Promise<void>;
  fullUpdateNewById: (id: string, newData: UpdateDTO) => Promise<void>;
  removeNewById: (id: string) => Promise<void>;
}

export class NewsRepository implements INewsRepository {
  private readonly SLUG_WORDS_COUNT = 15;

  private readonly database: IDatabase;

  public constructor(container: IContainer) {
    this.database = container[DATABASE] as IDatabase;
  }

  public async getNewByField(field: string, value: string): Promise<INew | null> {
    if (!['id', 'title', 'slug', 'creatorId'].includes(field)) {
      throw new InternalServerError('Incorrect field name in newsRepository');
    }

    const sql = this.database.connection;
    const news = await sql<INew[]>`
      SELECT * FROM news.news WHERE ${sql(field)} = ${value} LIMIT 1;
    `;

    return news[0] ?? null;
  }

  public async getNewsCount(): Promise<number> {
    const count = await this.database.connection<Array<{ newsCount: string }>>`
      SELECT count(*) as "newsCount" FROM news.news;
    `;

    return Number(count[0].newsCount);
  }

  public async getNewsByPages({ page, limit }: PagesPaginationDTO): Promise<INew[]> {
    const offset = (page - 1) * limit;

    return this.database.connection<INew[]>`
      SELECT *
      FROM news.news
      ORDER BY "createdAt" DESC
      LIMIT ${limit} OFFSET ${offset};
    `;
  }

  public async addNew(newData: AddData): Promise<void> {
    const sql = this.database.connection;
    const newDataWithSlug: INew = {
      ...newData,
      slug: this.getCreatedSlug(newData.title),
    };

    await sql`INSERT INTO news.news ${sql(newDataWithSlug)};`;
  }

  public async fullUpdateNewById(newId: string, newData: UpdateDTO): Promise<void> {
    const sql = this.database.connection;
    const slug = this.getCreatedSlug(newData.title);

    await sql`UPDATE news.news SET ${sql({ ...newData, slug })} WHERE id = ${newId};`;
  }

  public async removeNewById(newId: string): Promise<void> {
    await this.database.connection`DELETE FROM news.news WHERE id = ${newId};`;
  }

  private getCreatedSlug(title: string): string {
    return createSlug(title.split(' ').slice(0, this.SLUG_WORDS_COUNT).join(' '));
  }
}
