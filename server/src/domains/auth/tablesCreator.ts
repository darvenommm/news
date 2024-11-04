import { default as bcrypt } from 'bcrypt';

import { TablesCreator } from '@/base/tableCreator';
import { getUniqueId } from '@/helpers';
import { Role, type IRole } from './types';
import { DATABASE, type IDatabase } from '@/database';
import { ADMIN_SETTINGS, type IAdminSettings } from '@/settings/admin';
import { EXTRA_SETTINGS, type IExtraSettings } from '@/settings/extra';

import type { Sql } from 'postgres';
import type { IContainer } from '@/container';
import type { UserCreatingData } from './types';

export const AUTH_TABLES_CREATOR = getUniqueId();

export class AuthTablesCreator extends TablesCreator {
  private readonly MAX_ROLE_LENGTH = 64;
  private readonly MAX_USERNAME_LENGTH = 32;
  private readonly MAX_EMAIL_LENGTH = 320;
  private readonly MAX_BCRYPT_LENGTH = 72;

  private readonly database: IDatabase;
  private readonly adminSettings: IAdminSettings;
  private readonly extraSettings: IExtraSettings;

  public constructor(container: IContainer) {
    super();
    this.database = container[DATABASE] as IDatabase;
    this.adminSettings = container[ADMIN_SETTINGS] as IAdminSettings;
    this.extraSettings = container[EXTRA_SETTINGS] as IExtraSettings;
  }

  public async create(): Promise<void> {
    return this.database.connection.begin(async (sql): Promise<void> => {
      await this.createTables(sql);
      await this.addRolesIfNeed(sql);
      await this.addAdminUserIfNeed(sql);
    });
  }

  private async createTables(sql: Sql): Promise<void> {
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS news.roles (
        name VARCHAR(${this.MAX_ROLE_LENGTH}) PRIMARY KEY
      );
    `);

    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS news.users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(${this.MAX_USERNAME_LENGTH}) NOT NULL UNIQUE,
        email VARCHAR(${this.MAX_EMAIL_LENGTH}) NOT NULL UNIQUE,
        "hashedPassword" VARCHAR(${this.MAX_BCRYPT_LENGTH}) NOT NULL,
        session UUID DEFAULT gen_random_uuid(),
        role VARCHAR(${this.MAX_ROLE_LENGTH}) REFERENCES news.roles(name)
        ON DELETE SET NULL
        ON UPDATE CASCADE
      );
    `);
  }

  private async addRolesIfNeed(sql: Sql): Promise<void> {
    const roles = Object.values(Role);
    const rolesFromDatabase = await sql<IRole[]>`SELECT name FROM news.roles;`;

    if (roles.length !== rolesFromDatabase.length) {
      for (const role of roles) {
        const roleFromDatabase = await sql`SELECT name FROM news.roles WHERE name = ${role};`;

        if (roleFromDatabase[0]) {
          continue;
        }

        await sql`INSERT INTO news.roles ${sql({ name: role }, 'name')};`;
      }
    }
  }

  private async addAdminUserIfNeed(sql: Sql): Promise<void> {
    const admins = await sql`
      SELECT *
      FROM news.roles
      WHERE name = ${Role.ADMIN}
      LIMIT 1;
    `;

    if (!admins.length) {
      const hashedPassword = await bcrypt.hash(
        this.adminSettings.password,
        this.extraSettings.saltRounds,
      );
      const adminData: UserCreatingData = {
        hashedPassword,
        email: this.adminSettings.email,
        username: this.adminSettings.username,
        role: Role.ADMIN,
      } as const;

      await sql`INSERT INTO news.users ${sql(adminData)};`;
    }
  }
}
