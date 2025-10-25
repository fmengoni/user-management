import { Injectable } from '@nestjs/common';
import { RoleEntity } from './model/role.entity';
import { PermissionsService } from '../permissions/permissions.service';
import { IRole } from '../users/types/role.type';
import { RoleMongoRepository } from './repository/role.repository';
import { PermissionEntity } from '../permissions/model/permission.entity';
import { Types } from 'mongoose';

@Injectable()
export class RolesService {
  constructor(
    private readonly roleMongoRepository: RoleMongoRepository,
    private readonly permissionsService: PermissionsService,
  ) {}

  async findByName(name: string): Promise<RoleEntity> {
    return await this.roleMongoRepository.findOne({
      where: { name },
    });
  }

  async findByIds(allRoleIds: Types.ObjectId[]) {
    return await Promise.all(
      allRoleIds.map((r) => {
        return this.findById(r);
      }),
    );
  }

  async findById(id: Types.ObjectId): Promise<RoleEntity> {
    const roleEntity = await this.roleMongoRepository.findByKey(id.toHexString());
    roleEntity.permissions = await Promise.all(
      roleEntity.permissions.map((p) => {
        return this.permissionsService.findById(new Types.ObjectId(p.id));
      }),
    );
    return roleEntity;
  }

  async findAll(): Promise<RoleEntity[]> {
    const roles = (await this.roleMongoRepository.findAll()).results;
    return roles;
  }

  async create(role: Partial<IRole>): Promise<RoleEntity> {
    let entity = await this.roleMongoRepository.findOne({
      where: { name: role.name },
    });
    if (!entity) {
      const newRole = RoleEntity.build({
        name: role.name,
        permissions: role.permissions.map(
          (p) => new Types.ObjectId(p._id)
        ),
      });

      entity = await this.roleMongoRepository.create(newRole);
    } else {
      console.log('Role ya persistido en la base de datos');
    }
    entity.permissions = await this.permissionsService.findByIds(
      entity.permissions.map((p) => {
        return (p instanceof PermissionEntity) ? new Types.ObjectId(p.id) : p;
       })
    );

    return entity;
  }
}
