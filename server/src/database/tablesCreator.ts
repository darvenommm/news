import { TablesCreator } from '@/base/tableCreator';

import { getUniqueId } from '@/helpers';
import { DATABASE } from './database';
import { AUTH_TABLES_CREATOR } from '@/domains/auth';
import { NEWS_TABLES_CREATOR } from '@/domains/news';

import type { IContainer } from '@/container';
import type { IDatabase } from './database';

export const DATABASE_TABLES_CREATOR = getUniqueId();

export class DatabaseTablesCreator extends TablesCreator {
  private readonly database: IDatabase;
  private readonly tablesCreators: Iterable<TablesCreator>;

  public constructor(container: IContainer) {
    super();

    this.database = container[DATABASE] as IDatabase;

    const authTablesCreator = container[AUTH_TABLES_CREATOR] as TablesCreator;
    const newsTablesCreator = container[NEWS_TABLES_CREATOR] as TablesCreator;
    this.tablesCreators = [authTablesCreator, newsTablesCreator];
  }

  public async create(): Promise<void> {
    const sql = this.database.connection;

    await sql`CREATE SCHEMA IF NOT EXISTS news;`;

    for (const tablesCreator of this.tablesCreators) {
      await tablesCreator.create();
    }
  }
}
