import { default as bcrypt } from 'bcrypt';

import { InternalServerError } from '@/base/errors';
import { getUniqueId } from '@/helpers';
import { AUTH_REPOSITORY, type AddUserResult, type IAuthRepository } from './repository';

import type { IUser } from './types';
import type { SignUpDTO } from './dtos';
import type { IContainer } from '@/container';

export interface IAuthService {
  getUserById: (id: string) => Promise<IUser | null>;
  getUserByEmail: (email: string) => Promise<IUser | null>;
  getUserBySession: (session: string) => Promise<IUser | null>;
  getUserByUsername: (username: string) => Promise<IUser | null>;
  checkUserPassword: (id: string, password: string) => Promise<boolean>;
  addUser: (userData: SignUpDTO) => Promise<AddUserResult>;
}

export const AUTH_SERVICE = getUniqueId();

export class AuthService implements IAuthService {
  private readonly authRepository: IAuthRepository;

  public constructor(container: IContainer) {
    this.authRepository = container[AUTH_REPOSITORY] as IAuthRepository;
  }

  public async getUserById(id: string): Promise<IUser | null> {
    return this.authRepository.getUserByField('id', id);
  }

  public async getUserByEmail(email: string): Promise<IUser | null> {
    return this.authRepository.getUserByField('email', email);
  }

  public async getUserByUsername(username: string): Promise<IUser | null> {
    return this.authRepository.getUserByField('username', username);
  }

  public async getUserBySession(session: string): Promise<IUser | null> {
    return this.authRepository.getUserByField('session', session);
  }

  public async addUser(userData: SignUpDTO): Promise<AddUserResult> {
    return this.authRepository.addUser(userData);
  }

  public async checkUserPassword(id: string, password: string): Promise<boolean> {
    const user = await this.getUserById(id);

    if (!user) {
      throw new InternalServerError('User is not existed in the check password');
    }

    return bcrypt.compare(password, user.hashedPassword);
  }
}
