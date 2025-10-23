import { Connection, Schema } from 'mongoose';
import { LogAction, LogEntity } from '../model/LogEntity';
import MongoRepository, { MongoEntityId } from 'src/infra/repositories/mongo.repository';
import { Inject } from '@nestjs/common';
import { MONGO_DATABASE_PROVIDER } from 'src/infra/database/database.module';
import { MongoDatabase } from 'src/infra/database/mongo.database';

const LogSchema = new Schema<LogEntity & MongoEntityId>({
  _id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userData: { type: Map, of: Schema.Types.Mixed, required: true },
  entityModel: { type: String, required: false },
  entityId: { type: String, required: false },
  action: { type: String, enum: LogAction, required: true },
  before: { type: Map, of: Schema.Types.Mixed },
  after: { type: Map, of: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

export class MongoLogRepository extends MongoRepository<LogEntity> {
  constructor(@Inject(MONGO_DATABASE_PROVIDER) database: MongoDatabase) {
    super(LogEntity, LogSchema, 'logs', database);
  }
}
