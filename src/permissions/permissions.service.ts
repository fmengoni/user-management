import { Injectable } from '@nestjs/common';
import { PermissionEntity } from './model/permission.entity';
import { RoleEntity } from '../roles/model/role.entity';
import { PermissionMongoRepository } from './repository/permission.repository';
import { IPermission } from '../users/types/permission.type';
import { Types } from 'mongoose';

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

  async findByIds(allPermissionIds: Types.ObjectId[]) {
    return await Promise.all(
      allPermissionIds.map((p) => {
        return this.findById(p._id);
      }),
    );
  }

  async findById(_id: Types.ObjectId): Promise<PermissionEntity> {
    return await this.permissionMongoRepository.findByKey(_id.toHexString());
  }

  async findAllByRole(role: RoleEntity): Promise<PermissionEntity[]> {
    return await Promise.all(
      role.permissions.map((p) => {
        return this.findById(new Types.ObjectId(p.id));
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
