import mongoose, { FilterQuery, SortOrder, Types } from 'mongoose';
import MongoDBException from '../../domain/exceptions/mongodb.exception';
import { MongoDatabase } from '../database/mongo.database';

import EntityModel from 'src/domain/entities/base.entity';
import {
  IRepository,
  PaginationResult,
  SearchRepository,
} from 'src/domain/repository/repository.interface';

export type MongoEntityId = {
  _id: string;
};

type EntityConstructor<T> = new (...args: any[]) => T;

class MongoRepository<T extends EntityModel> implements IRepository<T> {
  protected model: mongoose.Model<any>;

  constructor(
    private readonly entityConstructor: EntityConstructor<T>,
    schema: mongoose.Schema,
    tableName: string,
    database: MongoDatabase,
  ) {
    if (!tableName) {
      throw new MongoDBException(
        `${this.constructor.toString()} is having TABLE_NAME null or empty: ${tableName}`,
      );
    }
    this.model = database.getConnection().model(tableName, schema);
  }

  async create(entity: T): Promise<T> {
    try {
      // const model = new this.model(this.mapToPersistence(entity));
      const model = new this.model(entity);
      const record = await model.save();

      return this.mapToEntity(record);
    } catch (err) {
      console.log(JSON.stringify(err));
      console.log(JSON.stringify(entity));
      throw new MongoDBException(`[create] Error: ${JSON.stringify(err)}`);
    }
  }

  async findOne(options?: SearchRepository<T>): Promise<T | null> {
    const query = this.model.findOne(this.transformWhere(options?.where ?? {}));

    if (options?.order) {
      query.sort(this.transformOrder(options.order));
    }

    const record = await query.exec();

    return record ? this.mapToEntity(record) : null;
  }

  async findAll(options?: SearchRepository<T>): Promise<PaginationResult<T>> {
    const order = options?.order
      ? this.transformOrder(options.order)
      : undefined;

    const total = await this.model.countDocuments();
    const query = this.model.find();

    if (order) {
      query.sort(order);
    }

    const records = await query.exec();
    return {
      page: 1,
      pageSize: total,
      total,
      results: records.map((item: any) => this.mapToEntity(item)) as T[],
    };
  }

  async find(options?: SearchRepository<T>): Promise<PaginationResult<T>> {
    const where = this.transformWhere(options?.where ?? {});
    const order = options?.order
      ? this.transformOrder(options.order)
      : undefined;

    const pageSize = options?.limit ?? 10;
    const skip = options?.skip ?? 0;

    const total = await this.model.countDocuments(where);

    const query = this.model.find(where);

    if (order) {
      query.sort(order);
    }

    query.limit(pageSize).skip(skip);

    const records = await query.exec();

    return {
      page: Math.floor(skip / pageSize) + 1,
      pageSize,
      total,
      results: records.map((item: any) => this.mapToEntity(item)) as T[],
    };
  }

  async findByKey(key: string): Promise<T> {
    const record = await this.model.findById(new Types.ObjectId(key));

    if (!record)
      throw new MongoDBException(
        `Id not foound for Entity '${this.entityConstructor.name}'`,
      );

    return this.mapToEntity(record);
  }

  async update(entity: T): Promise<T> {
    if (!entity.isDirty()) return entity;

    const updated = await this.model.updateOne(
      { _id: entity.id },
      { $inc: { __v: 1 }, ...this.mapToPersistence(entity) },
    );
    if (!updated.modifiedCount)
      throw new MongoDBException(
        `[update] Entity no found for key ${entity.id}`,
      );

    return entity;
  }

  async delete(where: Partial<T>, force?: boolean): Promise<number> {
    const filter = this.transformWhere(where);
    const fields = Object.keys(filter);

    if (fields.length < 1 && !force) {
      throw new MongoDBException(
        `Deleting invoke without any filter. Please, check your request or call with force param`,
      );
    }

    const task = await this.model.deleteMany(filter);

    return task.deletedCount;
  }

  protected mapToPersistence(entity: T): any {
    const { id, ...rest } = entity as any;

    const obj = { ...rest, _id: id };

    return obj;
  }

  protected mapToEntity(data: any): T {
    const { _id, ...object } = Object.assign({}, data.toObject());
    const entity = new this.entityConstructor({ ...object, _id, id: _id });

    return entity;
  }

  private transformWhere(where: Partial<T>): FilterQuery<T> {
    const filter: FilterQuery<T> = where ?? {};

    if (filter.id) {
      filter._id = filter.id;
    }

    delete filter.id;

    return filter;
  }

  private transformOrder(order: { [P in keyof T]?: 'ASC' | 'DESC' }): Record<
    string,
    SortOrder
  > {
    const transformed: Record<string, SortOrder> = {};
    for (const key in order) {
      const direction = order[key];
      if (direction) {
        transformed[key] = direction.toLowerCase() as SortOrder;
      }
    }

    return transformed;
  }
}

export default MongoRepository;
