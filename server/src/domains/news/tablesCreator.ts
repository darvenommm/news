import { TablesCreator } from '@/base/tableCreator';
import { getUniqueId } from '@/helpers';
import { DATABASE, type IDatabase } from '@/database';
import { TITLE_CONSTRAINTS, TEXT_CONSTRAINTS } from './constraints';

import type { IContainer } from '@/container';

export const NEWS_TABLES_CREATOR = getUniqueId();

export class NewsTablesCreator extends TablesCreator {
  private readonly database: IDatabase;

  public constructor(container: IContainer) {
    super();

    this.database = container[DATABASE] as IDatabase;
  }

  public async create(): Promise<void> {
    const sql = this.database.connection;

    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS news.news (
        id UUID PRIMARY KEY,
        title VARCHAR(${TITLE_CONSTRAINTS.maxLength}) NOT NULL,
        slug TEXT NOT NULL,
        text TEXT NOT NULL,
        "creatorId" UUID REFERENCES news.users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT "newsTextLength" CHECK (LENGTH(text) <= ${TEXT_CONSTRAINTS.maxLength})
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "indexNewsSlug" ON news.news USING BTREE (slug);
      CREATE INDEX IF NOT EXISTS "indexNewsCreatedAt" ON news.news USING BTREE ("createdAt");
    `);
  }
}
