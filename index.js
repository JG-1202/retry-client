const RetryExecutor = require('./src/services/retryExecutor');
const SettingsLoader = require('./src/services/settingsLoader');

class RetryClient {
  constructor(settings) {
    const settingsLoader = new SettingsLoader({ settings });
    this.settings = settingsLoader.settings;
  }

  retry(functionToRetry, functionInput) {
    const retryExecutor = new RetryExecutor({
      settings: this.settings,
    });
    return retryExecutor.retry(functionToRetry, functionInput);
  }
}
module.exports = RetryClient;
