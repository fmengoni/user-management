import EntityModel from '../../domain/entities/base.entity';

export class PermissionEntity extends EntityModel {
  public entityName: string = 'Permission';
  public name: string;
  public permission: string;

  constructor(data: Record<string, any>) {
    super(data);
    this.name = data.name;
    this.permission = data.permission;
  }
}
