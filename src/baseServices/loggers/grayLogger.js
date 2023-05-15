const graylog2 = require('graylog2');

module.exports = (logName, { graylogServer, graylogPort, hostname }) => {
  let logger;

  if (graylogServer != null) {
    logger = new graylog2.graylog({
      servers: [
        {
          host: graylogServer,
          port: graylogPort
        }
      ],
      hostname: hostname
    });
    logger.on('error', function (err) {
      console.error(err.message);
    });
  } else {
    logger = null;
  }

  function createData(moduleName, functionName, meta) {
    return {
      meta: meta !== undefined ? meta : {},
      method: functionName,
      node: meta && meta.node ? meta.node : '',
      module: moduleName,
      process: logName.toUpperCase()
    };
  }

  return {
    info: (moduleName, functionName, message, meta) => {
      if (logger != null) {
        logger.info(message, message, createData(moduleName, functionName, meta));
      }
    },
    error: (moduleName, functionName, message, meta) => {
      if (logger != null) {
        logger.error(message, message, createData(moduleName, functionName, meta), new Date());
      }
    },
    warning: (moduleName, functionName, message, meta) => {
      if (logger != null) {
        logger.warning(message, message, createData(moduleName, functionName, meta), new Date());
      }
    },
    warn: (moduleName, functionName, message, meta) => {
      if (logger != null) {
        logger.warning(message, message, createData(moduleName, functionName, meta), new Date());
      }
    },
    debug: (moduleName, functionName, message, meta) => {
      if (logger != null) {
        logger.debug(message, message, createData(moduleName, functionName, meta), new Date());
      }
    },
    trace: (moduleName, functionName, message, meta) => {
      if (logger != null) {
        logger.notice(message, message, createData(moduleName, functionName, meta), new Date());
      }
    }
  };
};

// const graylogServer = config.Get('GRAYLOG_SERVER'); //process.env.GRAYLOG_SERVER;
// const graylogPort = config.Get('GRAYLOG_SERVER_PORT') || 12201;
// const hostname = config.Get('CLIENT') || 'DEV'; //process.env.CLIENT != undefined ? process.env.CLIENT.toLocaleUpperCase() : "DEV";
