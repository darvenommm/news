import { isIP, isPort } from 'validator';

import { getUniqueId } from '@/helpers';

import type { IServerSettings } from './types';

export const SERVER_SETTINGS = getUniqueId();

export class ServerSettings implements IServerSettings {
  public get host(): string {
    const host = process.env.SERVER_HOST ?? '127.0.0.1';

    if (!isIP(host)) {
      throw new Error('The SERVER_HOST is an incorrect host value');
    }

    return host;
  }

  public get port(): number {
    const port = process.env.SERVER_PORT ?? '8000';

    if (!isPort(port)) {
      throw new Error('The SERVER_PORT is an incorrect port value');
    }

    return Number(port);
  }
}
