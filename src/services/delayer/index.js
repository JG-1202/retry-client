class Delayer {
  constructor(settings) {
    this.settings = settings;
    this.lastDelay = 0;
  }

  getNextDelay() {
    if (this.lastDelay === 0) {
      this.lastDelay = this.settings.minimumBackOff;
    } else if (this.settings.fixedBackOff) {
      this.lastDelay += this.settings.fixedBackOff;
    } else {
      this.lastDelay *= this.settings.backOffExponent;
    }
    this.lastDelay = Math.round(Math.min(this.lastDelay, this.settings.maximumBackOff));
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
