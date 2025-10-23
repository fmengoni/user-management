import { IRepository } from '../../domain/repository/repository.interface';
import { PermissionEntity } from '../../permissions/model/permission.entity';

export type IPermissionRepository = IRepository<PermissionEntity>;
