import { Inject, Injectable } from '@nestjs/common';
import { RoleEntity } from '../../roles/model/role.entity';
import MongoRepository from '../../infra/repositories/mongo.repository';
import { RoleSchema } from '../schema/role.schema';
import { IRoleRepository } from './role.repository.interface';
import { MongoDatabase } from '../../infra/database/mongo.database';
import { MONGO_DATABASE_PROVIDER } from '../../infra/database/database.module';

@Injectable()
export class RoleMongoRepository
  extends MongoRepository<RoleEntity>
  implements IRoleRepository
{
  constructor(@Inject(MONGO_DATABASE_PROVIDER) database: MongoDatabase) {
    super(RoleEntity, RoleSchema, 'roles', database);
  }

  async findByIds(allRoleIds: string[]): Promise<RoleEntity[]> {
    const records = await this.model.find({ _id: { $in: allRoleIds } }).exec();
    return records.map((record) => this.mapToEntity(record));
  }
}
