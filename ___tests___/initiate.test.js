/* eslint-disable max-lines-per-function */
/* eslint-disable no-undef */
const RetryTimeoutClient = require('../index');
const retryHandler = require('../src/services/settingsLoader/src/retryHandler');
const errorHandler = require('../src/services/settingsLoader/src/errorHandler');

describe('Initiate Retry Client', () => {
  it('Load default settings when no input provided', () => {
    const retryTimeoutClient = new RetryTimeoutClient();
    expect(retryTimeoutClient.settings).toStrictEqual({
      retryHandler,
      errorHandler,
      fixedDelayIncrement: 0,
      minimumDelay: 100,
      delayExponent: 1.1,
      maximumDelay: 10000,
      maximumRetryCount: 5,
      timeout: 0,
    });
  });
  it('Load default settings', () => {
    const retryTimeoutClient = new RetryTimeoutClient({});
    expect(retryTimeoutClient.settings).toStrictEqual({
      retryHandler,
      errorHandler,
      fixedDelayIncrement: 0,
      minimumDelay: 100,
      delayExponent: 1.1,
      maximumDelay: 10000,
      maximumRetryCount: 5,
      timeout: 0,
    });
  });
  it('Load custom settings', () => {
    const customRetryHandler = (event) => event;
    const customErrorHandler = (event) => event;
    const retryTimeoutClient = new RetryTimeoutClient({
      retryHandler: customRetryHandler,
      errorHandler: customErrorHandler,
      fixedDelayIncrement: 10,
      minimumDelay: 99,
      delayExponent: 1.01,
      maximumDelay: 9999,
      maximumRetryCount: 3,
      timeout: 3000,
    });
    expect(retryTimeoutClient.settings).toStrictEqual({
      retryHandler: customRetryHandler,
      errorHandler: customErrorHandler,
      fixedDelayIncrement: 10,
      minimumDelay: 99,
      delayExponent: 1.01,
      maximumDelay: 9999,
      maximumRetryCount: 3,
      timeout: 3000,
    });
  });
});
