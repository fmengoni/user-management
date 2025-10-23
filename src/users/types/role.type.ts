import { IPermission } from './permission.type';

export interface IRole {
  _id: string;
  name: string;
  permissions: IPermission[];
}
