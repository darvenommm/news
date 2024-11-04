import { default as bcrypt } from 'bcrypt';

import { InternalServerError } from '@/base/errors';
import { getUniqueId } from '@/helpers';
import { DATABASE, type IDatabase } from '@/database';
import { EXTRA_SETTINGS, type IExtraSettings } from '@/settings/extra';
import { Role } from './types';

import type { IUser, UserCreatingData } from './types';
import type { SignUpDTO } from './dtos';
import type { IContainer } from '@/container';

export interface AddUserResult {
  readonly session: string;
}

export interface IAuthRepository {
  addUser: (userData: SignUpDTO) => Promise<AddUserResult>;
  getUserByField: (fieldName: string, value: string) => Promise<IUser | null>;
}

export const AUTH_REPOSITORY = getUniqueId();

export class AuthRepository implements IAuthRepository {
  private readonly DEFAULT_USER_ROLE: Role = Role.USER;

  private readonly database: IDatabase;
  private readonly extraSettings: IExtraSettings;

  public constructor(container: IContainer) {
    this.database = container[DATABASE] as IDatabase;
    this.extraSettings = container[EXTRA_SETTINGS] as IExtraSettings;
  }

  public async addUser({ email, username, password }: SignUpDTO): Promise<AddUserResult> {
    const sql = this.database.connection;
    const hashedPassword = await bcrypt.hash(password, this.extraSettings.saltRounds);
    const userData: UserCreatingData = {
      email,
      username,
      hashedPassword,
      role: this.DEFAULT_USER_ROLE,
    } as const;

    await sql`INSERT INTO news.users ${sql(userData)}`;

    const user = (await this.getUserByField('email', email))!;

    return { session: user.session };
  }

  public async getUserByField(fieldName: string, value: string): Promise<IUser | null> {
    if (!['id', 'email', 'username', 'session'].includes(fieldName)) {
      throw new InternalServerError('Incorrect fieldName');
    }

    const sql = this.database.connection;

    const selectResult = await sql<IUser[]>`
      SELECT *
      FROM news.users
      WHERE ${sql(fieldName)} = ${value}
      LIMIT 1;
    `;

    return selectResult[0] ?? null;
  }
}
