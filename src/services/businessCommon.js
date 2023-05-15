module.exports = (model, log, { debugLogLevel = true, useCache = false } = {}) => {
    let cache = [];
    const cleanCache = () => (cache = []);
    const removeFromCache = (id) => (cache = cache.filter((a) => a._id !== id));
    const updateCache = (newItems) => {
      if (newItems) {
        if (Array.isArray(newItems)) {
          for (let i = 0; i < newItems.length; i++) {
            let found = cache.find((a) => a._id === newItems[i]._id);
            if (found) found = newItems[i];
            else cache.push(newItems[i]);
          }
        } else {
          let found = cache.find((a) => a._id === newItems._id);
          if (found) found = newItems;
          else cache.push(newItems);
        }
      }
    };
  
    /**
     * Get manu elements
     * @param { Object } query : mongoose query
     * @param { Object } sort : mongoose sorting
     * @returns { Promise<Array<Object>> }
     */
    const GetAll = async (query, sort = {}) => {
      try {
        if (typeof query !== 'object') {
          throw new Error('Query should be an object ');
        }
        if (debugLogLevel) log.debug('GetAll', '', { query, sort });
        const result = await model.Find(query, sort);
        if (useCache) updateCache(result);
        return result;
      } catch (err) {
        log.error('GetAll', err.message, '');
        throw err;
      }
    };
  
    /**
     * Get many elements with a pagination
     * @param { Object } query : mongoose query
     * @param { Number } page
     * @param { Number } limit
     * @param { Object } sort : mongoose sorting
     */
    const Paginate = async (query, page = 1, limit = 25, sort = {}) => {
      try {
        if (typeof query !== 'object') {
          throw new Error('Query should be an object ');
        }
        if (debugLogLevel) log.debug('Paginate', '', { query, page, limit, sort });
        const result = await model.Paginate(query, page, limit, sort);
        if (useCache) updateCache(result.docs);
        return result;
      } catch (err) {
        log.error('Paginate', err.message, '');
        throw err;
      }
    };
  
    /**
     * Find one element base on mongoId
     * @param { String } id : mongoose id
     * @returns { Promise<Object> }
     */
    const GetById = async (id) => {
      try {
        if (typeof id !== 'string') {
          throw new Error('Id should be a string ');
        }
        if (debugLogLevel) log.debug('Get', '', { id });
        if (useCache) {
          const result = cache.find((a) => a._id === id);
          if (result) return result;
        }
        const result = await model.FindOne({ _id: id });
        if (useCache) updateCache(result);
        return result;
      } catch (err) {
        log.error('Get', err.message, '');
        throw err;
      }
    };
  
    /**
     * Find one element
     * @param { Object } query : mongoose query
     * @returns { Promise<Object> }
     */
    const Get = async (query) => {
      try {
        if (typeof query !== 'object') {
          throw new Error('Query should be an object ');
        }
        if (debugLogLevel) log.debug('Get', '', { query });
        const result = await model.FindOne(query);
        if (useCache) updateCache(result);
        return result;
      } catch (err) {
        log.error('Get', err.message, '');
        throw err;
      }
    };
  
    /**
     * Add
     * @param { Object } item
     * @returns { Object }
     */
    const Add = async (item) => {
      try {
        if (typeof item !== 'object') {
          throw new Error('Query should be an object ');
        }
        if (debugLogLevel) log.debug('Add', '', { item });
        const result = await model.Save(item);
        if (useCache) updateCache(result);
        return result;
      } catch (err) {
        log.error('Add', err.message, '');
        throw err;
      }
    };
  
    /**
     * Update one element
     * @param { Object } id
     * @param { Object } fields
     */
    const Update = async (id, fields) => {
      try {
        if (typeof id !== 'string') {
          throw new Error('Query should be an object ');
        }
        if (typeof fields !== 'object') {
          throw new Error('Fields should be an object');
        }
        if (fields === undefined) return;
        if (debugLogLevel) log.debug('Update', '', { id, fields });
        const result = await model.UpdateOne({ _id: id }, fields);
        if (useCache) removeFromCache(id);
        return result;
      } catch (err) {
        log.error('Update', err.message, '');
        throw err;
      }
    };
  
    const UpdateOne = async (query, fields) => {
      try {
        if (typeof query !== 'object') {
          throw new Error('Query should be an object ');
        }
        if (typeof fields !== 'object') {
          throw new Error('Fields should be an object');
        }
        if (debugLogLevel) log.debug('UpdateQuery', '', { query, fields });
        const result = await model.UpdateOne(query, fields);
        if (useCache) cleanCache();
        return result;
      } catch (err) {
        log.error('UpdateQuery', err.message, '');
        throw err;
      }
    };
  
    /**
     * Update Many elements
     * @param { Object } query : query filter for the update
     * @param { Object } fields
     */
    const UpdateMany = async (query, fields) => {
      try {
        if (typeof query !== 'object') {
          throw new Error('Query should be an object ');
        }
        if (typeof fields !== 'object') {
          throw new Error('Fields should be an object');
        }
        if (debugLogLevel) log.debug('UpdateMany', '', { query, fields });
        const result = await model.UpdateMany(query, fields);
        if (useCache) cleanCache();
        return result;
      } catch (err) {
        log.error('UpdateMany', err.message, '');
        throw err;
      }
    };
  
    /**
     * Delete
     * @param { Object } id
     */
    const Delete = async (id) => {
      try {
        if (typeof id !== 'string') {
          throw new Error('Id should be an object ');
        }
        if (debugLogLevel) log.debug('Delete', '', { id });
        const result = await model.DeleteOne({ _id: id });
        if (useCache) removeFromCache(id);
        return result;
      } catch (err) {
        log.error('Delete', err.message, '');
        throw err;
      }
    };
    /**
     * Delete One elements
     * @param { Object } query : query filter for the deletion
     */
    const DeleteOne = async (query) => {
      try {
        if (typeof query !== 'object') {
          throw new Error('Query should be an object ');
        }
        if (debugLogLevel) log.debug('DeleteMany', '', { query });
        if (useCache) cleanCache();
        return await model.DeleteOne(query);
      } catch (err) {
        log.error('DeleteMany', err.message, '');
        throw err;
      }
    };
    /**
     * Delete many elements
     * @param { Object } query : query filter for the deletion
     */
    const DeleteMany = async (query) => {
      try {
        if (typeof query !== 'object') {
          throw new Error('Query should be an object ');
        }
        if (debugLogLevel) log.debug('DeleteMany', '', { query });
        if (useCache) cleanCache();
        return await model.DeleteMany(query);
      } catch (err) {
        log.error('DeleteMany', err.message, '');
        throw err;
      }
    };
  
    /**
     * Count elements based on query
     * @param {Object} query
     */
    const Count = async (query) => {
      try {
        if (typeof query !== 'object') {
          throw new Error('Query should be an object ');
        }
        if (debugLogLevel) log.debug('Count', '', { query });
        return await model.Count(query);
      } catch (err) {
        log.error('Count', err.message, '');
        throw err;
      }
    };
  
    const Distinct = async (query, field) => {
      try {
        return await model.Dal.distinct(field, query);
      } catch (err) {
        log.error('Distinct', err.message, { query, field });
        throw err;
      }
    };
  
    const CountAField = async (query, field) => {
      try {
        const result = await model.Dal.aggregate([
          { $match: query },
          { $group: { _id: field, count: { $sum: 1 } } },
          { $sort: { count: 1 } }
        ]);
        return result;
      } catch (err) {
        log.error('CountAField', err.message, { query, field });
        throw err;
      }
    };
  
    const InsertMany = async (items) => {
      try {
        const result = await model.SaveMany(items);
        return result;
      } catch (err) {
        log.error('InsertMany', err.message);
        throw err;
      }
    };
  
    return {
      model,
  
      /**
       * Get all items on custom query
       * @param { Object} query
       * @param { Object } sort
       * @returns { Promise<Array<Object>> }
       * */
      GetAll,
  
      /**
       * Get an item with a custom query
       * @param { Object } query
       * @returns { Promise<Object> }
       * */
      Get,
  
      /**
       * Get an item
       * @param { String } id
       * @returns { Promise<Object> }
       * */
      GetById,
  
      /**
       * Get many elements with a pagination
       * @param { Object } query : mongoose query
       * @param { Number } page
       * @param { Number } limit
       * @param { Object } sort : mongoose sorting
       * @param { Promise<PaginateResult> }
       */
      Paginate,
  
      /**
       * Add
       * @param { Object } item
       * @returns { Promise<Object> } added item
       */
      Add,
  
      /**
       * Delete
       * @param { String } id
       * @returns { Promise<Object> } : contains deletedCount
       */
      Delete,
  
      /**
       * Delete 1 item based on a selection query
       * @param { Object } query
       * @returns { Promise<Object> } : contains deletedCount
       */
      DeleteOne,
  
      /**
       * Delete base on a selection query
       * @param { Object } query
       * @returns { Promise<Object> } : contains deletedCount
       */
      DeleteMany,
  
      /**
       * Update
       * @param { String } id
       * @param { Object } fields
       * @returns { Promise<Object> } : contains nModified
       */
      Update,
  
      /**
       * Update many items based on a selection query
       * @param { Object } query
       * @param { Object } fields
       * @returns { Promise<Object> } : contains nModified
       */
      UpdateMany,
  
      /**
       * Update 1 item based on a selection query
       * @param { Object } query
       * @param { Object } fields
       * @returns { Promise<Object> } : contains nModified
       */
      UpdateOne,
  
      /**
       * Counts the number of item based on a selection query
       * @param { Object } query
       * @returns { Promise<Number> }
       * */
      Count,
  
      /**
       * Select distinct values 'field'
       * @param { Object } query
       * @param { String } field
       * @returns { Promise<Array<string>>}
      */
      Distinct,
  
      /**
       * Count all different values of 'field'
       * @param { Object } query
       * @param { String } field
       * @returns { Promise<Array<string>>}
      */
      CountAField,
  
      InsertMany
    };
  };