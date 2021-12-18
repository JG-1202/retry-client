const RetryExecutor = require('./src/services/retryExecutor');
const SettingsLoader = require('./src/services/settingsLoader');
const TimeoutExecutor = require('./src/services/timeoutExecutor');

class RetryTimeoutClient {
  constructor(settings) {
    const settingsLoader = new SettingsLoader(settings);
    this.settings = settingsLoader.settings;
  }

  retry(functionToCall, functionInput) {
    const retryExecutor = new RetryExecutor(this.settings);
    return retryExecutor.retry(functionToCall, functionInput);
  }

  timeout(functionToCall, functionInput) {
    const timeoutExecutor = new TimeoutExecutor(this.settings);
    return timeoutExecutor.timeout(functionToCall, functionInput);
  }

  retryTimeout(functionToCall, functionInput) {
    const retry = (callback, input) => {
      const retryExecutor = new RetryExecutor(this.settings);
      return retryExecutor.retry(callback, input);
    };
    return this.timeout(retry, [functionToCall, functionInput]);
  }
}

module.exports = RetryTimeoutClient;
