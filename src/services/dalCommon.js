const PaginateResult = require('../entity/entity.paginateResult')
const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const getModel = (modelName, schema) => {
  try {
    return mongoose.model(modelName)
  } catch (err) {
    return mongoose.model(modelName, schema)
  }
}

/**
 * INDEXES EXAMPLE
 * [
 *      { fields: { mac: 1, serial: -1 }, options: {} },
 *      { fields: { timeStamp: -1 }, options: { expireAfterSeconds: 15778800 } }
 * ]
 */

class CommonDal {
  constructor (schema, modelName, indexes, entity, schemaOptions = {}) {
    this.modelName = modelName
    this.schema = new mongoose.Schema(schema, schemaOptions)
    this.schema.plugin(paginate)
    for (let i = 0; i < indexes.length; i++) {
      this.schema.index(indexes[i].fields, indexes[i].options)
    }
    this.Dal = getModel(this.modelName, this.schema)
    this.Entity = entity
  }

  GetModel () {
    return this.Dal
  }

  /**
   * Find one element
   * @param { Object } query : mongoose query
   * @returns { Promise<Object> }
   */
  async FindOne (query) {
    const result = await this.Dal.findOne(query).exec()
    if (result === null) {
      return null
    }
    return new this.Entity(result)
  }

  /**
   * Get manu elements
   * @param { Object } query : mongoose query
   * @param { Object } sort : mongoose sorting
   * @returns { Promise<Array<Object>> }
   */
  async Find (query, sort) {
    const result = await this.Dal.find(query).sort(sort)
    return result.map((element) => new this.Entity(element))
  }

  /**
   * Get many elements with a pagination
   * @param { Object } query : mongoose query
   * @param { Number } page
   * @param { Number } limit
   * @param { Object } sort : mongoose sorting
   */
  async Paginate (query, page, limit, sort) {
    const result = await this.Dal.paginate(query, {
      page,
      limit,
      sort
    })
    result.docs = result.docs.map((element) => new this.Entity(element))
    return new PaginateResult(result)
  }

  /**
   * Add
   * @param { Object } item
   * @returns { Object }
   */
  async Save (item) {
    delete item._id
    const newItem = new this.Dal(item)
    const result = await newItem.save()
    return new this.Entity(result)
  }

  /**
   * Save Many
   * @param { Array<Object> } item
   * @returns { Object }
   */
	 async SaveMany (items) {
    for (let i = 0; i < items.length; i++) {
      delete items[i]._id
    }
    const result = await this.Dal.insertMany(items)
    return result.map(item => new this.Entity(item))
  }

  /**
   * Update
   * @param { Object } query : query filter for the update
   * @param { Object } fields
   */
  async UpdateOne (query, fields) {
    try {
      const result = await this.Dal.updateOne(query, fields)
      return result
    } catch (err) {
      throw err
    }
  }

  /**
   * Update Many elements
   * @param { Object } query : query filter for the update
   * @param { Object } fields
   */
  async UpdateMany (query, fields) {
    const result = await this.Dal.updateMany(query, fields)
    return result
  }

  /**
   * Delete
   * @param { Object } query : query filter for the deletion
   */
  async DeleteOne (query) {
    const result = await this.Dal.deleteOne(query)
    return result
  }

  /**
   * Delete many elements
   * @param { Object } query : query filter for the deletion
   */
  async DeleteMany (query) {
    const result = await this.Dal.deleteMany(query)
    return result
  }

  /**
   * Count elements based on query
   * @param {Object} query
   */
  async Count (query) {
    const result = await this.Dal.countDocuments(query).exec()
    return result
  }
}

module.exports = CommonDal
