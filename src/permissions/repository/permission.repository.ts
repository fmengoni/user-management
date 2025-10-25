import { Inject, Injectable } from '@nestjs/common';
import MongoRepository from '../../infra/repositories/mongo.repository';
import { MONGO_DATABASE_PROVIDER } from '../../infra/database/database.module';
import { MongoDatabase } from '../../infra/database/mongo.database';
import { PermissionEntity } from '../../permissions/model/permission.entity';
import { PermissionSchema } from '../schema/permission.schema';
import { IPermissionRepository } from './permission.repository.interface';

@Injectable()
export class PermissionMongoRepository
  extends MongoRepository<PermissionEntity>
  implements IPermissionRepository
{
  constructor(@Inject(MONGO_DATABASE_PROVIDER) database: MongoDatabase) {
    super(PermissionEntity, PermissionSchema, 'permissions', database);
  }

  async findByIds(allPermissionIds: string[]) {
    const records = await this.model
      .find({ _id: { $in: allPermissionIds } })
      .exec();
    return records.map((record) => PermissionEntity.build(record.toObject()));
  }
}
