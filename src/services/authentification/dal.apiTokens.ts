import { Schema, Model } from 'mongoose';

export default function () {
  const MODEL_NAME = 'apitokens';
  const dalC = require('../dalCommon');

  const entity = require('../../entity/entity.apiToken');
  const schema: Schema = new Schema({
    name: { type: String, required: true },
    token: { type: String, required: true },
    creationDate: { type: Date, required: true },
    clientId: { type: String, required: false, default: '' },
    companyId: { type: String, required: true },
    lastUsage: { type: Date, required: false },
  });

  return new dalC(schema, MODEL_NAME, [], entity);
}