import { asClass } from 'awilix';

import { AUTH_TABLES_CREATOR, AuthTablesCreator } from './tablesCreator';
import { AUTH_SERVICE, AuthService } from './service';
import { AUTH_REPOSITORY, AuthRepository } from './repository';
import { AUTH_MIDDLEWARE, AuthMiddleware } from './middleware';
import { AUTH_CONTROLLER, AuthController } from './controller';
import { SIGN_UP_VALIDATOR, SignUpValidator } from './validators/signUp';
import { SIGN_IN_VALIDATOR, SignInValidator } from './validators/signIn';
import { IS_AUTHENTICATED_GUARD, IsAuthenticatedGuard } from './guards/isAuthenticated';

import type { AwilixContainer } from 'awilix';

export const addAuthDependenciesIntoContainer = (container: AwilixContainer): void => {
  container.register({
    [AUTH_TABLES_CREATOR]: asClass(AuthTablesCreator).singleton(),
    [AUTH_SERVICE]: asClass(AuthService).singleton(),
    [AUTH_REPOSITORY]: asClass(AuthRepository).singleton(),
    [AUTH_MIDDLEWARE]: asClass(AuthMiddleware).singleton(),
    [AUTH_CONTROLLER]: asClass(AuthController).singleton(),
    [SIGN_UP_VALIDATOR]: asClass(SignUpValidator).singleton(),
    [SIGN_IN_VALIDATOR]: asClass(SignInValidator).singleton(),
    [IS_AUTHENTICATED_GUARD]: asClass(IsAuthenticatedGuard).singleton(),
  });
};
