import { Injectable } from '@nestjs/common';
import { UserEntity } from './model/user.entity';
import { UserMongoRepository } from './repository/user.repository';
import { IUser } from './types/user.type';
import * as bcrypt from 'bcryptjs';
import { RolesService } from '../roles/roles.service';
import { RoleEntity } from '../roles/model/role.entity';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    private readonly userMongoRepository: UserMongoRepository,
    private readonly roleService: RolesService,
  ) {}

  async findByUsername(username: string): Promise<UserEntity> {
    const userEntity = await this.userMongoRepository.findOne({
      where: { username },
    });

    const rolesEntities = await this.roleService.findByIds(
      userEntity.roles.map((r) => {
        return r instanceof RoleEntity ? new Types.ObjectId(r.id): r;
      })
    );

    userEntity.roles = rolesEntities;
    return userEntity;
  }

  async findAll(): Promise<UserEntity[]> {
    return (await this.userMongoRepository.findAll()).results;
  }

  async create(user: Partial<IUser>): Promise<UserEntity> {
    let entity = await this.userMongoRepository.findOne({
      where: { username: user.username },
    });
    if (!entity) {
      const salt = await bcrypt.genSalt();

      entity = await this.userMongoRepository.create(
        UserEntity.build({
          email: user.email,
          password: await bcrypt.hash(user.password, salt),
          roles: user.roles.map((r) => new Types.ObjectId(r._id)),
          salt: salt,
          username: user.username,
        }),
      );
    } else {
      console.log('Usuario ya persistido en la base de datos');
    }

    entity.roles = await this.roleService.findByIds(
      user.roles.map((r) => new Types.ObjectId(r._id)),
    );
    return entity;
  }
}
