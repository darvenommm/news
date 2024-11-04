import { default as postgres } from 'postgres';

import { getUniqueId } from '@/helpers';
import { DATABASE_SETTINGS } from '@/settings/database';

import type { Sql } from 'postgres';
import type { IDatabaseSettings } from '@/settings/database';
import type { IContainer } from '@/container';

export interface IDatabase {
  readonly connection: Sql;
}

export const DATABASE = getUniqueId();

export class Database implements IDatabase {
  private readonly _connection: Sql;

  public constructor(container: IContainer) {
    const databaseSettings = container[DATABASE_SETTINGS] as IDatabaseSettings;
    const { host, port, username, password, name: database } = databaseSettings;
    this._connection = postgres({ host, port, username, password, database });
  }

  public get connection(): Sql {
    return this._connection;
  }
}
