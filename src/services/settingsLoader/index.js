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
      fixedBackOff: (setting) => !Number.isNaN(Number(setting)),
      minimumBackOff: (setting) => Number(setting),
      backOffExponent: (setting) => Number(setting),
      maximumBackOff: (setting) => Number(setting),
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
      fixedBackOff: 0,
      minimumBackOff: 100,
      backOffExponent: 1.5,
      maximumBackOff: 10000,
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
