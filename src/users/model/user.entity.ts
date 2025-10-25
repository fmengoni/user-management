import { Types } from 'mongoose';
import EntityModel from '../../domain/entities/base.entity';
import { RoleEntity } from '../../roles/model/role.entity';

export class UserEntity extends EntityModel {
  public entityName: string = 'User';
  public username: string;
  public email: string;
  public password: string;
  public salt: string;
  public roles: (Types.ObjectId | RoleEntity)[];

  constructor(data: Record<string, any>) {
    super(data);
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.salt = data.salt;
    this.roles = data.roles;
  }
}
