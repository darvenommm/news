import { IUser } from '@/domains/auth';

declare global {
  namespace Express {
    export interface Request {
      payload: unknown;
      user: IUser | null;
    }
  }
}
