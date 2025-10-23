import { IRepository } from '../../domain/repository/repository.interface';
import { UserEntity } from '../../users/model/user.entity';

export type IUserRepository = IRepository<UserEntity>;
