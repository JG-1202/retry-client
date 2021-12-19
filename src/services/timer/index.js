class Timer {
  constructor(settings) {
    this.settings = settings;
  }

  setTimer() {
    return new Promise((resolve, reject) => {
      this.id = setTimeout(() => {
        reject(new Error(`Timed out after ${this.settings.timeout} ms.`));
      }, this.settings.timeout);
    });
  }

  stopTimer() {
    clearTimeout(this.id);
  }
}

module.exports = Timer;
