import { asClass, createContainer, InjectionMode } from 'awilix';

import { addAuthDependenciesIntoContainer } from './domains/auth';
import { addNewsDependenciesIntoContainer } from './domains/news';
import { ADMIN_SETTINGS, AdminSettings } from './settings/admin';
import { DATABASE_SETTINGS, DatabaseSettings } from './settings/database';
import { EXTRA_SETTINGS, ExtraSettings } from './settings/extra';
import { SERVER_SETTINGS, ServerSettings } from './settings/server';
import { DATABASE, Database, DATABASE_TABLES_CREATOR, DatabaseTablesCreator } from './database';
import { APPLICATION, Application } from './app';

import type { AwilixContainer } from 'awilix';

export interface IContainer {
  [key: string]: unknown;
}

export class Container {
  private _container: AwilixContainer;

  public constructor() {
    const container = createContainer({
      injectionMode: InjectionMode.PROXY,
      strict: true,
    });

    container.register({
      [ADMIN_SETTINGS]: asClass(AdminSettings).singleton(),
      [DATABASE_SETTINGS]: asClass(DatabaseSettings).singleton(),
      [EXTRA_SETTINGS]: asClass(ExtraSettings).singleton(),
      [SERVER_SETTINGS]: asClass(ServerSettings).singleton(),
      [DATABASE]: asClass(Database).singleton(),
      [DATABASE_TABLES_CREATOR]: asClass(DatabaseTablesCreator).singleton(),
      [APPLICATION]: asClass(Application).singleton(),
    });

    addAuthDependenciesIntoContainer(container);
    addNewsDependenciesIntoContainer(container);

    this._container = container;
  }

  public get innerContainer(): AwilixContainer {
    return this._container;
  }

  public get<T>(id: string): T {
    return this._container.cradle[id];
  }
}
