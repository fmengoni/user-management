import { IRepository } from '../../domain/repository/repository.interface';
import { RoleEntity } from '../../roles/model/role.entity';

export type IRoleRepository = IRepository<RoleEntity>;
