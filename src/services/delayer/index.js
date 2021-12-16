class Delayer {
  constructor({ settings }) {
    this.settings = settings;
    this.lastDelay = 0;
  }

  getNextDelay() {
    if (this.lastDelay === 0) {
      this.lastDelay = this.settings.minimumDelay;
    } else if (this.settings.fixedDelayIncrement) {
      this.lastDelay += this.settings.fixedDelayIncrement;
    } else {
      this.lastDelay *= this.settings.delayExponent;
    }
    this.lastDelay = Math.round(Math.min(this.lastDelay, this.settings.maximumDelay));
    return this.lastDelay;
  }

  delay() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, this.getNextDelay());
    });
  }
}

module.exports = Delayer;
