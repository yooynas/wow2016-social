var util = require('util');
var AppUtils = require('../../utils/app-utils');

module.exports = function() {
  // Warn of version mismatch between global "lcm" binary and local installation
  // of Locomotive.
  if (this.version !== require('locomotive').version) {
    console.warn(util.format('version mismatch between local (%s) and global (%s) Locomotive module', require('locomotive').version, this.version));
  }

  console.log('Loading the Application specific Parameters from file utils/app-params.json');
  AppUtils.getJSONFile("./utils/app-params.json", function(app_params) {
    console.log('done...');
    global.app_params = app_params;
  });
}
