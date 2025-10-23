import { Injectable } from '@nestjs/common';
import { RoleEntity } from './model/role.entity';
import { PermissionsService } from '../permissions/permissions.service';
import { IRole } from '../users/types/role.type';
import { RoleMongoRepository } from './repository/role.repository';
import { PermissionEntity } from 'src/permissions/model/permission.entity';

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

  async findByIds(allRoleIds: (string | RoleEntity)[]) {
    return await Promise.all(
      allRoleIds.map((r) => {
        return this.findById(r instanceof RoleEntity ? r.id : r);
      }),
    );
  }

  async findById(id: string): Promise<RoleEntity> {
    const roleEntity = await this.roleMongoRepository.findByKey(id);
    roleEntity.permissions = await Promise.all(
      roleEntity.permissions.map((p) => {
        return this.permissionsService.findById(
          p instanceof PermissionEntity ? p.id : p,
        );
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
        permissions: role.permissions.map((p) => p._id),
      });

      entity = await this.roleMongoRepository.create(newRole);
    } else {
      console.log('Role ya persistido en la base de datos');
    }
    entity.permissions = await this.permissionsService.findByIds(
      entity.permissions,
    );

    return entity;
  }
}
