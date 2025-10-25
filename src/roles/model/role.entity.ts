import { PermissionEntity } from 'src/permissions/model/permission.entity';
import EntityModel from '../../domain/entities/base.entity';
import { Types } from 'mongoose';

export class RoleEntity extends EntityModel {
  public entityName: string = 'Role';
  public name: string;
  public permissions: (PermissionEntity | Types.ObjectId)[];

  constructor(data: Record<string, any>) {
    super(data);
    this.name = data.name;
    this.permissions = data.permissions;
  }
}
