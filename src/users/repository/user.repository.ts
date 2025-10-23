import { Inject, Injectable } from '@nestjs/common';
import MongoRepository from '../../infra/repositories/mongo.repository';
import { UserEntity } from '../../users/model/user.entity';
import { MONGO_DATABASE_PROVIDER } from '../../infra/database/database.module';
import { MongoDatabase } from '../../infra/database/mongo.database';
import { IUserRepository } from './user.repository.interface';
import { UserSchema } from '../schema/user.schema';

@Injectable()
export class UserMongoRepository
  extends MongoRepository<UserEntity>
  implements IUserRepository
{
  constructor(@Inject(MONGO_DATABASE_PROVIDER) database: MongoDatabase) {
    super(UserEntity, UserSchema, 'users', database);
  }
}
