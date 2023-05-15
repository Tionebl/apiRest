import PaginateResult from '../entity/entity.paginateResult';
import mongoose, { Model, Schema, Document, FilterQuery, UpdateQuery } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

const getModel = <T extends Document>(modelName: string, schema: Schema<T>): Model<T> => {
  try {
    return mongoose.model<T>(modelName);
  } catch (err) {
    return mongoose.model<T>(modelName, schema);
  }
};

interface Index {
  fields: Record<string, number>;
  options: Record<string, any>;
}

class CommonDal<T extends Document> {
  private modelName: string;
  private schema: Schema<T>;
  private Dal: Model<T>;
  private Entity: any;

  constructor(schema: Schema<T>, modelName: string, indexes: Index[], entity: any, schemaOptions: Record<string, any> = {}) {
    this.modelName = modelName;
    this.schema = new mongoose.Schema(schema, schemaOptions);
    this.schema.plugin(paginate);
    for (let i = 0; i < indexes.length; i++) {
      this.schema.index(indexes[i].fields, indexes[i].options);
    }
    this.Dal = getModel<T>(this.modelName, this.schema);
    this.Entity = entity;
  }

  GetModel(): Model<T> {
    return this.Dal;
  }

  async FindOne(query: FilterQuery<T>): Promise<T | null> {
    const result = await this.Dal.findOne(query).exec();
    if (result === null) {
      return null;
    }
    return new this.Entity(result);
  }

  async Find(query: FilterQuery<T>, sort: Record<string, any>): Promise<T[]> {
    const result = await this.Dal.find(query).sort(sort);
    return result.map((element: T) => new this.Entity(element));
  }

  async Paginate(query: FilterQuery<T>, page: number, limit: number, sort: Record<string, any>): Promise<PaginateResult<T>> {
    const result = await this.Dal.paginate(query, {
      page,
      limit,
      sort
    });
    result.docs = result.docs.map((element: T) => new this.Entity(element));
    return new PaginateResult<T>(result);
  }

  async Save(item: T): Promise<T> {
    delete item._id;
    const newItem = new this.Dal(item);
    const result = await newItem.save();
    return new this.Entity(result);
  }

  async SaveMany(items: T[]): Promise<T[]> {
    for (let i = 0; i < items.length; i++) {
      delete items[i]._id;
    }
    const result = await this.Dal.insertMany(items);
    return result.map((item: T) => new this.Entity(item));
  }

  async UpdateOne(query: FilterQuery<T>, fields: UpdateQuery<T>): Promise<any> {
    try {
      const result = await this.Dal.updateOne(query, fields);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async UpdateMany(query: FilterQuery<T>, fields: UpdateQuery<T>): Promise<any> {
    const result = await this.Dal.updateMany(query, fields);
    return result;
  }

  async DeleteOne(query: FilterQuery<T>): Promise<any> {
    const result = await this.Dal.deleteOne(query);
    return result;
  }


  async DeleteMany(query: FilterQuery<T>): Promise<any> {
    const result = await this.Dal.deleteMany(query);
    return result;
  }

  async Count(query: FilterQuery<T>): Promise<number> {
    const result = await this.Dal.countDocuments(query).exec();
    return result;
  }
}

export default CommonDal;
