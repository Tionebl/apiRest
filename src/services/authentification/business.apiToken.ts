
let $name = 'apiTokensService';

export default function ({ mainLog }: { mainLog: any }) {
  const logger = mainLog($name);
  const dal = require('./dal.apiTokens')();
  const business = require('../businessCommon')(dal, logger, false);

  return {
    GetById: business.GetById,
    GetByToken: (token: string) => business.Get({ token: token }),
    Get: business.Get,

    GetAll: business.GetAll,

    Add: business.Add,

    Update: business.Update,

    UpdateMany: business.UpdateMany,

    Delete: business.Delete,

    DeleteMany: business.DeleteMany,

    Count: business.Count
  };
}

module.exports.$name = $name;
module.exports.$dep = [];