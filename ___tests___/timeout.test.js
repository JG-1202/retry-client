/* eslint-disable max-lines-per-function */
/* eslint-disable no-undef */
const RetryTimeoutClient = require('../index');

describe('Retry', () => {
  it('Call timeout client successful resolve', async () => {
    const retryTimeoutClient = new RetryTimeoutClient({ timeout: 1000 });
    const functionToCall = jest.fn(() => new Promise((resolve) => {
      resolve('success');
    }));
    const result = await retryTimeoutClient.timeout(functionToCall, ['a', 1, 'b', 2]);
    expect(result).toStrictEqual('success');
    expect(functionToCall).toBeCalledWith('a', 1, 'b', 2);
    expect(functionToCall).toBeCalledTimes(1);
  });
  it('Call safeTimeout successful resolve', async () => {
    const retryTimeoutClient = new RetryTimeoutClient({ timeout: 1000 });
    const functionToCall = jest.fn(() => new Promise((resolve) => {
      resolve('success');
    }));
    const result = await retryTimeoutClient.safeTimeout(functionToCall, ['a', 1, 'b', 2]);
    expect(result).toStrictEqual('success');
    expect(functionToCall).toBeCalledWith('a', 1, 'b', 2);
    expect(functionToCall).toBeCalledTimes(1);
  });
  it('Call timeout client function timed out', async () => {
    const retryResponses = [];
    const errorResponses = [];
    const retryHandler = jest.fn((response) => retryResponses.push(response));
    const errorHandler = jest.fn((response) => errorResponses.push(response));
    const retryTimeoutClient = new RetryTimeoutClient({
      timeout: 1000, retryHandler, errorHandler,
    });
    const functionToCall = jest.fn(() => new Promise((resolve) => {
      setTimeout(() => {
        resolve('Success.');
      }, 3000).unref();
    }));
    let errorMessage = null;
    try {
      await retryTimeoutClient.timeout(functionToCall, ['a', 1]);
    } catch (err) {
      errorMessage = err.message;
    }
    expect(errorMessage).toStrictEqual('Timed out after 1000 ms.');
    expect(functionToCall).toBeCalledWith('a', 1);
    expect(functionToCall).toBeCalledTimes(1);
    expect(errorHandler).toHaveBeenCalledTimes(1);
    expect(retryHandler).toHaveBeenCalledTimes(0);
    expect(retryResponses.length).toStrictEqual(0);
    expect(errorResponses.length).toStrictEqual(1);
    expect(errorResponses[0].error.message).toStrictEqual('Timed out after 1000 ms.');
  });
  it('Call safeTimeout function timed out', async () => {
    const retryResponses = [];
    const errorResponses = [];
    const retryHandler = jest.fn((response) => retryResponses.push(response));
    const errorHandler = jest.fn((response) => errorResponses.push(response));
    const retryTimeoutClient = new RetryTimeoutClient({
      timeout: 1000, retryHandler, errorHandler,
    });
    const functionToCall = jest.fn(() => new Promise((resolve) => {
      setTimeout(() => {
        resolve('Success.');
      }, 3000).unref();
    }));
    await retryTimeoutClient.safeTimeout(functionToCall, ['a', 1]);
    expect(functionToCall).toBeCalledWith('a', 1);
    expect(functionToCall).toBeCalledTimes(1);
    expect(errorHandler).toHaveBeenCalledTimes(1);
    expect(retryHandler).toHaveBeenCalledTimes(0);
    expect(retryResponses.length).toStrictEqual(0);
    expect(errorResponses.length).toStrictEqual(1);
    expect(errorResponses[0].error.message).toStrictEqual('Timed out after 1000 ms.');
  });
  it('Call timeout client without function input', async () => {
    const retryTimeoutClient = new RetryTimeoutClient({ timeout: 1000 });
    const functionToCall = jest.fn(() => new Promise((resolve) => {
      resolve('success');
    }));
    const result = await retryTimeoutClient.timeout(functionToCall);
    expect(result).toStrictEqual('success');
    expect(functionToCall).toBeCalledWith();
    expect(functionToCall).toBeCalledTimes(1);
  });
});
