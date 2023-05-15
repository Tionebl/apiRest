// module.exports = () => {
//     const mongoose = require('mongoose');
//     const bcrypt = require('bcrypt');
//     const MODEL_NAME = 'users';
//     const dalC = require('../dalCommon');
  
//     const entity = require('../../entity/entity.user');
//     const schema = new mongoose.Schema({
//       firstname: { type: String, default: '' },
//       lastname: { type: String, default: '' },
//       username: { type: String, index: true, unique: true, required: true },
//       email: { type: String, unique: true, require: false },
//       lastLogin: { type: Date, default: '' },

//       password: { type: String, required: true },
//       token: { type: String },
//       tokenCreation: { type: Date, default: null },
//       language: { type: String, default: 'fr' },
//       homepagePath: { type: String },
//       role: { type: String, default: 'user' },

//     });
//     const indexes = [];
  
//     schema.pre('save', function (next) {
//       const user = this;
//       if (!user.isModified('password')) return next();
  
//       user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
//       next();
//     });
  
//     schema.methods.comparePassword = async function (password) {
//       return new Promise((resolve, reject) => {
//         bcrypt.compare(password, this.password, function (err, isMatch) {
//           if (err) return reject(err);
//           return resolve(isMatch);
//         });
//       });
//     };
  
//     return new dalC(schema, MODEL_NAME, indexes, entity);
//   };
  