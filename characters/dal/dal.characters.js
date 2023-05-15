module.exports = (entity, constants) => {
    const MODEL_NAME = 'characters';
    const dalC = require('../../dalCommon');
    const schema = {
        name: { type: String, required: true },
        type: { type: String, required: true },
        spec: { type: String, required: true },
    };
  
    const indexes = [];
    return new dalC(schema, MODEL_NAME, indexes, entity);
  };