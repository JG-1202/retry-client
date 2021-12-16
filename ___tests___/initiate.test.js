/* eslint-disable max-lines-per-function */
/* eslint-disable no-undef */
const RetryClient = require('../index');
const retryHandler = require('../src/services/settingsLoader/src/retryHandler');
const errorHandler = require('../src/services/settingsLoader/src/errorHandler');

describe('Initiate Retry Client', () => {
  it('Load default settings when no input provided', () => {
    const retryClient = new RetryClient();
    expect(retryClient.settings).toStrictEqual({
      retryHandler,
      errorHandler,
      fixedDelayIncrement: 0,
      minimumDelay: 100,
      delayExponent: 1.1,
      maximumDelay: 10000,
      maximumRetryCount: 5,
    });
  });
  it('Load default settings', () => {
    const retryClient = new RetryClient({});
    expect(retryClient.settings).toStrictEqual({
      retryHandler,
      errorHandler,
      fixedDelayIncrement: 0,
      minimumDelay: 100,
      delayExponent: 1.1,
      maximumDelay: 10000,
      maximumRetryCount: 5,
    });
  });
  it('Load custom settings', () => {
    const customRetryHandler = (event) => event;
    const customErrorHandler = (event) => event;
    const retryClient = new RetryClient({
      retryHandler: customRetryHandler,
      errorHandler: customErrorHandler,
      fixedDelayIncrement: 10,
      minimumDelay: 99,
      delayExponent: 1.01,
      maximumDelay: 9999,
      maximumRetryCount: 3,
    });
    expect(retryClient.settings).toStrictEqual({
      retryHandler: customRetryHandler,
      errorHandler: customErrorHandler,
      fixedDelayIncrement: 10,
      minimumDelay: 99,
      delayExponent: 1.01,
      maximumDelay: 9999,
      maximumRetryCount: 3,
    });
  });
});
