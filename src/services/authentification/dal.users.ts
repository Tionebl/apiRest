import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import dalC from '../testdalCommon';

export default function () {
  const MODEL_NAME = 'users';
  const entity = require('../../entity/entity.user');
  const schema: Schema = new mongoose.Schema({
    firstname: { type: String, default: '' },
    lastname: { type: String, default: '' },
    username: { type: String, index: true, unique: true, required: true },
    email: { type: String, unique: true, require: false },
    lastLogin: { type: Date, default: '' },
    creationDate: { type: Date, default: '' },
    password: { type: String, required: true },
    token: { type: String },
    tokenCreation: { type: Date, default: null },
    isSupportTeam: { type: Boolean, default: 'false' },
    clientId: { type: String, default: '' },
    companyId: { type: String, default: '' },
    language: { type: String, default: 'fr' },
    homepagePath: { type: String },
    role: { type: String, default: 'user' },
    dateFormat: { type: String, default: 'fr' },
    alertsOn: { type: Boolean, required: false, default: false },
  });

  const indexes = [];

  schema.pre('save', function (next) {
    const user: any = this;
    if (!user.isModified('password')) return next();

    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
    next();
  });

  schema.methods.comparePassword = async function (password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return reject(err);
        return resolve(isMatch);
      });
    });
  };

  return new dalC(schema, MODEL_NAME, indexes, entity);
}