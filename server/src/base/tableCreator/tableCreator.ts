import type { Sql } from 'postgres';

export abstract class TablesCreator {
  public abstract create(): Promise<void>;
}
