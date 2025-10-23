import { IRole } from './role.type';

export interface IUser {
  username: string;
  email: string;
  password: string;
  roles?: IRole[];
}
