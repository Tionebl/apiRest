module.exports = {
  SERVICES: {
    AUTHENTICATION: 'authenticationsService',
    ERRORS: 'errorsService',
    APITOKEN: 'apiTokenService',
    USERS: 'usersService',
    APIS: 'apisService',
  },
  HELPERS: {
    DAL_COMMON: 'dalCommon',
    CONFIG: 'config',
    CONSTANTS: 'constants',
    UTILS: 'utils',
    ROOT_DIR: __dirname
  },
  LOGS: {
    MAIN_LOG: 'mainLog',
    PLUGIN_LOG: 'pluginLog',
    API_LOG: 'apiLog',
    APPLICATION_LOG: 'applicationLog'
  },
  LIBRARIES: {
    LIVEMODULE_MANAGER: 'liveModuleManager',
    DATE: 'Date'
  }
};
