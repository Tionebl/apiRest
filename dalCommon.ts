import mongoose, { Model, Document, Schema } from 'mongoose';

const getModel = <T extends Document>(modelName: string, schema: Schema<T>): Model<T> => {
  try {
    return mongoose.model<T>(modelName);
  } catch (err) {
    return mongoose.model<T>(modelName, schema);
  }
};

class CommonDal<T extends Document> {
  private modelName: string;
  private schema: Schema<T>;
  private Dal: Model<T>;
  private Entity: new (data: any) => T;

  constructor(
    schema: Schema<T>,
    modelName: string,
    indexes: { fields: any; options?: any }[],
    entity: new (data: any) => T,
    schemaOptions: any = {}
  ) {
    this.modelName = modelName;
    this.schema = new mongoose.Schema<T>(schema, schemaOptions);
    for (let i = 0; i < indexes.length; i++) {
      this.schema.index(indexes[i].fields, indexes[i].options);
    }
    this.Dal = getModel<T>(this.modelName, this.schema);
    this.Entity = entity;
  }

  GetModel(): Model<T> {
    return this.Dal;
  }

  async FindOne(query: any): Promise<T | null> {
    const result = await this.Dal.findOne(query).exec();
    if (result === null) {
      return null;
    }
    return new this.Entity(result);
  }

  async Find(query: any): Promise<T[]> {
    const result = await this.Dal.find(query);
    return result.map((element) => new this.Entity(element));
  }

  async FindById(id: any): Promise<T | null> {
    const result = await this.Dal.findOne({ _id: id });
    if (result === null) {
      return null;
    }
    return new this.Entity(result);
  }

  async Save(item: any): Promise<T> {
    delete item._id;
    const newItem = new this.Dal(item);
    const result = await newItem.save();
    return new this.Entity(result);
  }

  async DeleteOne(query: any): Promise<any> {
    const result = await this.Dal.deleteOne(query);
    return result;
  }
  async UpdateOne(query: any, fields: any): Promise<any> {
    try {
      const result = await this.Dal.updateOne(query, fields);
      return result;
    } catch (err) {
      throw err;
    }
  }
}


export = CommonDal;