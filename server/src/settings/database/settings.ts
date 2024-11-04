import { isIP, isPort } from 'validator';

import { getUniqueId } from '@/helpers';

import type { IDatabaseSettings } from './types';

export const DATABASE_SETTINGS = getUniqueId();

export class DatabaseSettings implements IDatabaseSettings {
  public get host(): string {
    const host = process.env.DB_HOST;

    if (!host || !isIP(host)) {
      throw new Error('The DB_HOST is incorrect or not found');
    }

    return host;
  }

  public get port(): number {
    const port = process.env.DB_PORT;

    if (!port || !isPort(port)) {
      throw new Error('The DB_PORT is incorrect or not found');
    }

    return Number(port);
  }

  public get name(): string {
    const name = process.env.DB_NAME;

    if (!name) {
      throw new Error('The DB_NAME is not found');
    }

    return name;
  }

  public get username(): string {
    const username = process.env.DB_USERNAME;

    if (!username) {
      throw new Error('The DB_USERNAME is not found');
    }

    return username;
  }

  public get password(): string {
    const password = process.env.DB_PASSWORD;

    if (!password) {
      throw new Error('The DB_PASSWORD is not found');
    }

    return password;
  }
}
