import type { User } from './src/domains/auth';

declare global {
  namespace Express {
    export interface Request {
      payload: unknown;
      user: User | null;
    }
  }
}
