const retryHandler = require('./src/retryHandler');
const errorHandler = require('./src/errorHandler');

class SettingsLoader {
  constructor(settings) {
    this.settings = {};
    this.loadSettings(settings);
  }

  setSetting({ settingName, settingValue, settingDefault }) {
    const settingsValidator = {
      retryHandler: (setting) => typeof setting === 'function',
      errorHandler: (setting) => typeof setting === 'function',
      fixedDelayIncrement: (setting) => !Number.isNaN(Number(setting)),
      minimumDelay: (setting) => Number(setting),
      delayExponent: (setting) => Number(setting),
      maximumDelay: (setting) => Number(setting),
      maximumRetryCount: (setting) => Number(setting),
      timeout: (setting) => !Number.isNaN(Number(setting)),
    };
    if (settingsValidator[settingName] && settingsValidator[settingName](settingValue)) {
      this.settings[settingName] = settingValue;
    } else {
      this.settings[settingName] = settingDefault;
    }
  }

  loadSettings(userSettings) {
    const defaultSettings = {
      retryHandler,
      errorHandler,
      fixedDelayIncrement: 0,
      minimumDelay: 100,
      delayExponent: 1.1,
      maximumDelay: 10000,
      maximumRetryCount: 5,
      timeout: 0,
    };
    if (userSettings && typeof userSettings === 'object') {
      Object.keys(defaultSettings).forEach((settingName) => (
        this.setSetting({
          settingName,
          settingValue: userSettings[settingName],
          settingDefault: defaultSettings[settingName],
        })
      ));
    } else {
      this.settings = defaultSettings;
    }
  }
}

module.exports = SettingsLoader;
