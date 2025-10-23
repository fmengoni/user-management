import { PermissionEntity } from 'src/permissions/model/permission.entity';
import EntityModel from '../../domain/entities/base.entity';

export class RoleEntity extends EntityModel {
  public entityName: string = 'Role';
  public name: string;
  public permissions: (string | PermissionEntity)[];

  constructor(data: Record<string, any>) {
    super(data);
    this.name = data.name;
    this.permissions = data.permissions;
  }
}
