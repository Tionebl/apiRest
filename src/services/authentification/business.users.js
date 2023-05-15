const $name = 'usersService';
module.exports = ({ mainLog, companiesService, clientsService }) => {
  const logger = mainLog($name);
  const dal = require('./dal.users')();
  const business = require('../businessCommon')(dal, logger);

  /**
   * Check if the user password is correct
   * @param { string } username
   * @param { string } password : clear password
   */
  async function Validate(username, password) {
    try {
      logger.debug('Validate', '', { username, password });
      const model = dal.GetModel();
      const userDal = await model.findOne({ username });
      if (!userDal) {
        return rej(new Error('No user found with username : ' + username));
      }
      const result = await userDal.comparePassword(password);
      return result;
    } catch (err) {
      logger.error('Validate', err.message, { username, password });
      throw err;
    }
  }

  /**
   * Change a user Password
   * @param { string } username
   * @param { string } password : new password value
   */
  async function ChangePassword(username, password) {
    try {
      logger.debug('ChangePassword', '', { username, password });
      const model = dal.GetModel();
      const user = await model.findOne({ username });
      if (!user) {
        throw new Error('No user found with username : ' + username);
      }
      user.password = password;

      const result = await user.save();
      return result;
    } catch (err) {
      logger.error('Validate', err.message, { username, password });
      throw err;
    }
  }

  async function Add(user) {
    if (!user.password || user.password === '') {
      user.password = 'noolitic!';
    }
    if (typeof user.role !== 'string') {
      throw new Error('No role defined');
    }
    if (user.role != 'admin' && user.role != 'sa' && user.role != 'user') {
      throw new Error('Role not allowed :' + user.role);
    }

    if (user.role != 'sa') {
      if (typeof user.companyId !== 'string' || user.companyId == '') {
        throw new Error('No company defined');
      }

      const company = await companiesService.GetById(user.companyId);
      if (!company) {
        throw new Error('Company ' + user.companyId + ' not found');
      }
    }

    if (user.role === 'user') {
      if (typeof user.clientId !== 'string') {
        throw new Error('No client defined');
      }
      const client = await clientsService.GetById(user.clientId);
      if (!client) {
        throw new Error('Client ' + user.clientId + ' not found');
      }
    }

    return business.Add(user);
  }

  return {
    GetById: business.GetById,
    Get: business.Get,
    GetByUsername: (username) => business.Get({ username }),
    GetByEmail: (email) => business.Get({ email }),
    GetAll: business.GetAll,
    Paginate: business.Paginate,
    Add,
    Update: business.Update,
    UpdateOne: business.UpdateOne,
    UpdateMany: business.UpdateMany,
    Delete: business.Delete,
    DeleteMany: business.DeleteMany,
    Count: business.Count,
    Validate,
    ChangePassword,
  };
};

module.exports.$name = $name;
module.exports.$dep = ['companiesService', 'clientsService']; // dependencies
