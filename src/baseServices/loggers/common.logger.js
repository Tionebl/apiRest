module.exports = (logName, config) => {
  const Logger = require('./consoleLogger');
  const utils = require('../utils');
  const log = Logger(logName, { color: true });
  const nodeEnv = config.Get('NODE_ENV') !== undefined ? config.Get('NODE_ENV').toLowerCase() : 'production';
  const isDebug = nodeEnv.toLowerCase() === 'debug';

  let grayLog;
  if (config.get('GRAYLOG_SERVER')) {
    const GrayLogger = require('./grayLogger');
    grayLog = GrayLogger(logName, {
      graylogServer: config.Get('GRAYLOG_SERVER'),
      graylogPort: config.Get('GRAYLOG_PORT') || 12201,
      hostname: config.Get('CLIENT') || 'DEV',
    });
  } else {
    grayLog = null;
  }

  const populateMetaWithWorkerId = (meta) => {
    if (meta) return { ...meta, workerId: utils.MyWorkerId() };
    return { workerId: utils.MyWorkerId() };
  };

  const info = (moduleName, functionName, message, meta) => {
    if (isDebug) log.info(moduleName, functionName, message, populateMetaWithWorkerId(meta));
    if (grayLog) {
      grayLog.info(moduleName, functionName, message, populateMetaWithWorkerId(meta));
    }
  };

  const error = (moduleName, functionName, message, meta) => {
    log.error(moduleName, functionName, message, populateMetaWithWorkerId(meta));
    if (grayLog) {
      grayLog.error(moduleName, functionName, message, populateMetaWithWorkerId(meta));
    }
  };

  const debug = (moduleName, functionName, message, meta) => {
    if (isDebug) log.debug(moduleName, functionName, message, populateMetaWithWorkerId(meta));
    if (grayLog && isDebug) {
      grayLog.debug(moduleName, functionName, message, populateMetaWithWorkerId(meta));
    }
  };

  const warn = (moduleName, functionName, message, meta) => {
    if (isDebug) log.warn(moduleName, functionName, message, meta);
    if (grayLog) {
      grayLog.warn(moduleName, functionName, message, meta);
    }
  };

  const silly = (moduleName, functionName, message, meta) => {
    if (isDebug) log.silly(moduleName, functionName, message, meta);
    if (grayLog && isDebug) {
      grayLog.trace(moduleName, functionName, message, meta);
    }
  };

  return function (moduleName) {
    return {
      info: (functionName, message, meta) => info(moduleName, functionName, message, meta),
      error: (functionName, message, meta) => error(moduleName, functionName, message, meta),
      debug: (functionName, message, meta) => debug(moduleName, functionName, message, meta),
      warn: (functionName, message, meta) => warn(moduleName, functionName, message, meta),
      silly: (functionName, message, meta) => silly(moduleName, functionName, message, meta),
      verbose: (functionName, message, meta) => silly(moduleName, functionName, message, meta),
    };
  };
};
