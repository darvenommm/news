// NOTE string enum only!
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export interface IUser {
  readonly id: string;
  readonly email: string;
  readonly username: string;
  readonly hashedPassword: string;
  readonly session: string;
  readonly role: Role;
}

export interface UserCreatingData
  extends Pick<IUser, 'email' | 'username' | 'hashedPassword' | 'role'> {}

export interface IRole {
  readonly name: string;
}
