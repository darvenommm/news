import type { InjectionModeType, LifetimeType } from 'awilix';

export interface Resolver {
  readonly name?: string;
  readonly lifetime?: LifetimeType;
  readonly injectionMode?: InjectionModeType;
}
