import { asClass } from 'awilix';

import { NEWS_CONTROLLER, NewsController } from './controller';
import { NEWS_SERVICE, NewsService } from './service';
import { NEWS_REPOSITORY, NewsRepository } from './repository';
import { NEWS_TABLES_CREATOR, NewsTablesCreator } from './tablesCreator';
import { ADD_VALIDATOR, AddValidator } from './validators/add';
import { UPDATE_VALIDATOR, UpdateValidator } from './validators/update';
import { PAGES_PAGINATION_VALIDATOR, pagesPaginationValidator } from './validators/pagesPagination';
import { CREATOR_OR_ADMIN_GUARD, CreatorOrAdminGuard } from './guard/creatorOrAdmin';

import type { AwilixContainer } from 'awilix';

export const addNewsDependenciesIntoContainer = (container: AwilixContainer): void => {
  container.register({
    [NEWS_CONTROLLER]: asClass(NewsController).singleton(),
    [NEWS_SERVICE]: asClass(NewsService).singleton(),
    [NEWS_REPOSITORY]: asClass(NewsRepository).singleton(),
    [NEWS_TABLES_CREATOR]: asClass(NewsTablesCreator).singleton(),
    [ADD_VALIDATOR]: asClass(AddValidator).singleton(),
    [UPDATE_VALIDATOR]: asClass(UpdateValidator).singleton(),
    [PAGES_PAGINATION_VALIDATOR]: asClass(pagesPaginationValidator).singleton(),
    [CREATOR_OR_ADMIN_GUARD]: asClass(CreatorOrAdminGuard).singleton(),
  });
};
