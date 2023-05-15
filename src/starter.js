module.exports = async function (commonLogger) {
    try {
      if (!commonLogger || commonLogger === undefined) {
        console.log('No common logger defined');
        process.exit(1);
      }
  
      const config = require('./baseServices/config')();
      const moduleName = 'Boostrap';
      const log = commonLogger('Starter', config)(moduleName);
  
      const bootstrap = require('./baseServices/bootstrap')(log);
  
      const references = require('./references');
  
      bootstrap.inject('references', require('./references'));
      bootstrap.inject(references.HELPERS.CONFIG, config);
      bootstrap.inject(
        references.HELPERS.CONSTANTS,
        require('./baseServices/constants')
      );
      bootstrap.inject(references.HELPERS.UTILS, require('./baseServices/utils'));
  
      bootstrap.inject(references.LOGS.MAIN_LOG, commonLogger('main', config));
      bootstrap.inject(
        references.LOGS.PLUGIN_LOG,
        commonLogger('plugin', config)
      );
      bootstrap.inject(references.LOGS.API_LOG, commonLogger('api', config));
      bootstrap.inject(
        references.LOGS.APPLICATION_LOG,
        commonLogger('applications', config)
      );
      bootstrap.inject(
        references.HELPERS.DAL_COMMON,
        require('./services/dalCommon')
      );
      bootstrap.inject(
        references.HELPERS.BUSINESS_COMMON,
        require('./services/businessCommon')
      );
      bootstrap.inject(
        references.SERVICES.GITLAB,
        require('./baseServices/gitlab')(config)
      );
  
      await require('./baseServices/database')(
        config,
        bootstrap.Services.mainLog('database')
      );
  
      bootstrap.inject(
        references.LIBRARIES.LIVEMODULE_MANAGER,
        new (require('live-plugin-manager').PluginManager)()
      );
      bootstrap.inject(references.LIBRARIES.DATE, require('moment'));
  
      await InjectAll(bootstrap, false);
  
      // Inject module that needs the whole bootstrap
      await InjectAll(bootstrap, true);
  
      // Inject appliation
      await require('./inject.application')(bootstrap);
  
      log.info('Start', 'main program has started');
  
      require('./boostrap').bootstrap = bootstrap;
  
      return bootstrap;
    } catch (err) {
      console.log(err.message);
      // process.exit(1)
    }
  };
  
  async function InjectAll(bootstrap, all) {
    const fg = require('fast-glob');
    const log = bootstrap.Services.mainLog('Starter');
    const searchPath = 'src/services/**/business.*.js';
    const result = await fg(searchPath, {
      onlyFiles: true,
  
      absolute: true,
      dot: false,
    });
    log.info('InjectAll', `Found ${result.length} services`);
    const modules = result.map((element) => require(element));
    let remaining = [...modules];
  
    while (remaining.length > 0) {
      const current = remaining.shift();
      if (current.$name && current.$name != '') {
        try {
          // check if all dependencies are loaded
          if (all) {
            if (
              current.$dep &&
              current.$dep.length === 1 &&
              current.$dep[0] === '*'
            ) {
              bootstrap.inject(current.$name, await current(bootstrap.Services));
            }
          } else {
            // not all
            let canBeLoaded = true;
            if (
              current.$dep &&
              current.$dep.length > 0 &&
              current.$dep[0] !== '*'
            ) {
              if (current.$dep[0] === '*') {
                console.log('Module *');
              }
              canBeLoaded = AreDependenciesLoaded(bootstrap, current.$dep);
              if (canBeLoaded) {
                const moduleCreated = await current(bootstrap.Services);
                bootstrap.inject(current.$name, moduleCreated);
              } else {
                remaining = [...remaining, current];
              }
            } else {
              if (!current.$dep || current.$dep.length === 0) {
                // no dependencies .. inject
                const moduleCreated = await current(bootstrap.Services);
                bootstrap.inject(current.$name, moduleCreated);
              }
            }
          }
        } catch (e) {
          log.error('Inject', e.message, current.$name, {
            dep: current.$dep,
          });
          process.exit(1);
        }
      }
    }
  }
  
  function AreDependenciesLoaded(boostrap, dependencies) {
    for (let i = 0; i < dependencies.length; i++) {
      const loaded = boostrap.Services[dependencies[i]];
      if (loaded === undefined) {
        return false;
      }
    }
  
    return true;
  }
  