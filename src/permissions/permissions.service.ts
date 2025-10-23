import { Injectable } from '@nestjs/common';
import { PermissionEntity } from './model/permission.entity';
import { RoleEntity } from '../roles/model/role.entity';
import { PermissionMongoRepository } from './repository/permission.repository';
import { IPermission } from '../users/types/permission.type';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly permissionMongoRepository: PermissionMongoRepository,
  ) {}

  async findByName(name: string): Promise<PermissionEntity> {
    return await this.permissionMongoRepository.findOne({
      where: { name },
    });
  }

  async findByIds(allPermissionIds: (string | PermissionEntity)[]) {
    return await Promise.all(
      allPermissionIds.map((p) => {
        return this.findById(p instanceof PermissionEntity ? p.id : p);
      }),
    );
  }

  async findById(_id: string) {
    return await this.permissionMongoRepository.findByKey(_id);
  }

  async findAllByRole(role: RoleEntity): Promise<PermissionEntity[]> {
    return await Promise.all(
      role.permissions.map((p) => {
        let id: string;
        if (p instanceof PermissionEntity) {
          id = p.id;
        } else {
          id = p;
        }
        return this.findById(id);
      }),
    );
  }

  async findAll(): Promise<PermissionEntity[]> {
    return (await this.permissionMongoRepository.findAll()).results;
  }

  async create(permission: Partial<IPermission>): Promise<PermissionEntity> {
    let entity = await this.permissionMongoRepository.findOne({
      where: { name: permission.name },
    });
    if (!entity) {
      entity = await this.permissionMongoRepository.create(
        PermissionEntity.build({
          name: permission.name,
          permission: permission.permission,
        }),
      );
    } else {
      console.log('Usuario ya persistido en la base de datos');
    }
    return entity;
  }
}
