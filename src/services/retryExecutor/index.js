const Delayer = require('../delayer');

class RetryExecutor {
  constructor({ settings }) {
    this.settings = settings;
    this.retryCount = 0;
    this.delayer = new Delayer({ settings });
  }

  isMaximumReached() {
    return this.retryCount > this.settings.maximumRetryCount;
  }

  async callFunction(func, funcInput) {
    this.retryCount += 1;
    return func(...funcInput);
  }

  async callRetryHandler(err) {
    const { stack, message, code } = err;
    return this.settings.retryHandler({
      iteration: this.retryCount,
      remaining: this.settings.maximumRetryCount - this.retryCount,
      error: { stack, message, code },
    });
  }

  async callErrorHandler(err) {
    const { stack, message, code } = err;
    return this.settings.errorHandler({
      iteration: this.retryCount,
      remaining: 0,
      error: { stack, message, code },
    });
  }

  async retry(func, funcInput) {
    return new Promise((resolve, reject) => {
      const retry = async () => {
        try {
          resolve(await this.callFunction(func, funcInput));
        } catch (error) {
          if (!this.isMaximumReached()) {
            await Promise.all([
              this.callRetryHandler(error),
              await this.delayer.delay(),
            ]);
            retry();
          } else {
            await this.callErrorHandler(error);
            reject(error);
          }
        }
      };
      retry();
    });
  }
}

module.exports = RetryExecutor;
