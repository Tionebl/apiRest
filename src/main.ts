const references = require('./references');

try {
  Start();
} catch (err) {
  console.log('STARTING ERROR DETECTED');
  console.log(err.message);
}

require('process')
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
  });

async function InitPlugins(startLog, config, commonLogger) {
  startLog.info('InitPlugin', '**** Init plugins STARTS *****');
  require('./baseServices/database')(config, commonLogger('Database'));

  const pluginPath = require('path').join(__dirname, './plugins');
  const gitLabService = require('./baseServices/gitlab')(config);
  const pluginsService = require('./services/plugins/business.plugins')({
    mainLog: commonLogger,
    gitLabService,
  });
  const LiveModuleManager =
    new (require('live-plugin-manager').PluginManager)();
  const installationService =
    require('./services/plugins/pluginsManager/pluginsManager.installation')(
      commonLogger('PluginsInstallations'),
      pluginPath,
      { pluginsService, gitLabService, LiveModuleManager }
    );

  await installationService.VerifyPluginFiles();
  startLog.info('InitPlugin', '**** Init plugins DONE *****');
}

async function Start() {
  let bootstrap = null;
  const moment = require('moment');
  const start = moment();
  try {
    console.log('*********** Start Application');
    bootstrap = await require('./starter')(
      require('./baseServices/loggers/common.logger')
    );

    await bootstrap.Services.pluginsManagerService.VerifyPluginFiles();
    await bootstrap.Services.pluginsManagerService.StartAll();
    await bootstrap.Services.apisService.Start();

    const log = await bootstrap.Services.mainLog('Main');
    log.info('Start', 'Sartup time : ' + moment().diff(start, 'ms') + ' ms');
  } catch (err) {
    const nodeEnv = require('process').env.NODE_ENV;
    if (nodeEnv && nodeEnv.toLowerCase() !== 'debug') {
      const emailService = bootstrap.Services[references.SERVICES.EMAILS];
      if (emailService) {
        emailService.ErrorEmail(err);
      }
    }
    process.exit(1);
  }
}
