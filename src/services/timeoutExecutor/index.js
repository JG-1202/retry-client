const Timer = require('../timer');

class TimeoutExecutor {
  constructor(settings) {
    this.settings = settings;
  }

  async callErrorHandler(err) {
    const { stack, message, code } = err;
    return this.settings.errorHandler({
      totalDuration: new Date().getTime() - this.startDt,
      error: { stack, message, code },
    });
  }

  async timeout(func, funcInput) {
    this.startDt = new Date().getTime();
    const timer = new Timer(this.settings);
    try {
      const result = await Promise.race([func(...funcInput), timer.setTimer()]);
      timer.stopTimer();
      return result;
    } catch (err) {
      await this.callErrorHandler(err);
      throw err;
    }
  }
}

module.exports = TimeoutExecutor;
