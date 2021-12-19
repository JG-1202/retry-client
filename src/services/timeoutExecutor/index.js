const Timer = require('../timer');

class TimeoutExecutor {
  constructor(settings) {
    this.settings = settings;
  }

  async timeout(func, funcInput) {
    this.startDt = new Date().getTime();
    const timer = new Timer(this.settings);
    try {
      const result = await Promise.race([func(...funcInput), timer.setTimer()]);
      timer.stopTimer();
      return result;
    } catch (err) {
      timer.stopTimer();
      throw err;
    }
  }
}

module.exports = TimeoutExecutor;
