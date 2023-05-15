const Characters = require('../entity/entity.characters.js');
module.exports = () => {
    const dal = require('./dal/dal.characters')(Characters)
    const model = dal.Dal;

    
    async function Get (query) {
        try{
            if (typeof query !== 'object') {
                throw new Error ('Query should be an object');
                
            }
            const result = dal.FindOne(query)
            return result 
        }catch (err) {
            throw err;
        };
    };
    
    async function GetAll (query) {
        try{
            if (typeof query !== 'object') {
                throw new Error ('Query should be an object');
            };
        const result = dal.Find(query);
        return result 
        }catch (err) {
            throw err;
        };
    };

    async function GetById(id) {
        try {
            if (typeof id !== 'string' ){
                throw new Error ('Query should be a string');
            };
            const result = dal.FindById(id);
            return result;

        }catch(err){
            throw err;
        }
    }
    async function Delete(id){
        try {
            if (typeof id !== 'string') {
                throw new Error('Id should be a string ');
            }
            const result = await dal.DeleteOne({ _id : id });
            return result;
        } catch (err) {
            //logger.error('DeleteOne', err.message);
            throw err;
        };
    };

    async function Add (characters) {
        try {
            if (typeof characters !== 'object') {
                throw new Error('Query should be an object');
            }
            const { name, type, spec } = characters;
            const exist = await dal.FindOne({ name, type, spec });
            if (exist) {
                throw new Error('Already Exist');
            }
            
            const result = await dal.Save(characters);
            // const doc = new model(equipment);
            // const result = await doc.save();
            return result;
        } catch (err) {
            //logger.error('AddOne', err.message);
            throw err;
        }
    }

    async function UpdateOne(id, fields){
        try {
          if(!fields) return;
    
          const exist = await GetById(id)
          if(!exist){
            throw new Error('This characters do not exist');
          }
    
          const result = await dal.UpdateOne({_id : id}, fields)
          return result
        }catch(err){
          throw err;
        }
      }

    return {
        Get,
        GetAll,
        Add,
        Delete,
        GetById,
        UpdateOne
        
    }
};