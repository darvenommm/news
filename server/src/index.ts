import { Container } from './container';
import { DATABASE_TABLES_CREATOR } from './database';

import { APPLICATION } from './app';

import type { TablesCreator } from './base/tableCreator';
import type { Application } from './app';

const container = new Container();

try {
  container.get<TablesCreator>(DATABASE_TABLES_CREATOR).create();
  container.get<Application>(APPLICATION).start();
} catch (error) {
  console.error(error);
} finally {
  await container.innerContainer.dispose();
}
