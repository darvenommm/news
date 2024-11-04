import { getUniqueId } from '@/helpers';

import type { IAdminSettings } from './types';

export const ADMIN_SETTINGS = getUniqueId();

export class AdminSettings implements IAdminSettings {
  public get username(): string {
    return process.env.ADMIN_USERNAME ?? 'admin';
  }

  public get email(): string {
    return process.env.ADMIN_EMAIL ?? 'admin@gmail.com';
  }

  public get password(): string {
    return process.env.ADMIN_PASSWORD ?? 'qwerty';
  }
}
