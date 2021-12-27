/* eslint-disable max-lines-per-function */
/* eslint-disable no-undef */
const RetryTimeoutClient = require('../index');

describe('Retry', () => {
  it('Call retry client, success on first attempt', async () => {
    const retryTimeoutClient = new RetryTimeoutClient();
    const functionToCall = jest.fn(() => new Promise((resolve) => {
      resolve('success');
    }));
    const result = await retryTimeoutClient.retry(functionToCall, ['a', 1, 'b', 2]);
    expect(result).toStrictEqual('success');
    expect(functionToCall).toBeCalledWith('a', 1, 'b', 2);
    expect(functionToCall).toBeCalledTimes(1);
  });
  it('Call safeRetry, success on first attempt', async () => {
    const retryTimeoutClient = new RetryTimeoutClient();
    const functionToCall = jest.fn(() => new Promise((resolve) => {
      resolve('success');
    }));
    const result = await retryTimeoutClient.safeRetry(functionToCall, ['a', 1, 'b', 2]);
    expect(result).toStrictEqual('success');
    expect(functionToCall).toBeCalledWith('a', 1, 'b', 2);
    expect(functionToCall).toBeCalledTimes(1);
  });
  it('Call retry client, success on third attempt', async () => {
    const retryResponses = [];
    const errorResponses = [];
    const retryHandler = jest.fn((response) => retryResponses.push(response));
    const errorHandler = jest.fn((response) => errorResponses.push(response));
    const retryTimeoutClient = new RetryTimeoutClient({
      retryHandler,
      errorHandler,
      timeout: 1000,
    });
    let counter = 0;
    const functionToCall = jest.fn(() => new Promise((resolve, reject) => {
      counter += 1;
      if (counter >= 3) {
        resolve('success');
      } else {
        reject(new Error('error'));
      }
    }));
    const result = await retryTimeoutClient.retry(functionToCall, ['a', 1, 'b', 2]);
    expect(result).toStrictEqual('success');
    expect(functionToCall).toBeCalledWith('a', 1, 'b', 2);
    expect(functionToCall).toBeCalledTimes(3);
    expect(retryHandler).toBeCalledTimes(2);
    expect(errorHandler).toBeCalledTimes(0);
    expect(retryResponses.length).toStrictEqual(2);
    expect(errorResponses.length).toStrictEqual(0);
    retryResponses.forEach((retryResponse, index) => {
      expect(retryResponse.error.message).toStrictEqual('error');
      expect(retryResponse.iteration).toStrictEqual(index + 1);
      expect(retryResponse.remaining).toStrictEqual(4 - index);
    });
  });
  it('Call retry client, fails every time', async () => {
    const retryTimeoutClient = new RetryTimeoutClient({ });
    const functionToCall = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error('error'));
    }));
    let errorMessage = null;
    try {
      await retryTimeoutClient.retry(functionToCall, ['a']);
    } catch (err) {
      errorMessage = err.message;
    }
    expect(errorMessage).toStrictEqual('error');
    expect(functionToCall).toBeCalledWith('a');
    expect(functionToCall).toBeCalledTimes(6);
  });
  it('Call retry client, fails every time, with custom retry-/errorHandler', async () => {
    const retryResponses = [];
    const errorResponses = [];
    const retryHandler = jest.fn((response) => retryResponses.push(response));
    const errorHandler = jest.fn((response) => errorResponses.push(response));
    const retryTimeoutClient = new RetryTimeoutClient({
      retryHandler,
      errorHandler,
    });
    const functionToCall = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error('test error'));
    }));
    let errorMessage = null;
    try {
      await retryTimeoutClient.retry(functionToCall, ['a', 1, 'b', 2]);
    } catch (err) {
      errorMessage = err.message;
    }
    expect(errorMessage).toStrictEqual('test error');
    expect(functionToCall).toBeCalledWith('a', 1, 'b', 2);
    expect(functionToCall).toBeCalledTimes(6);
    expect(retryHandler).toBeCalledTimes(5);
    expect(errorHandler).toBeCalledTimes(1);
    expect(retryResponses.length).toStrictEqual(5);
    retryResponses.forEach((retryResponse, index) => {
      expect(retryResponse.error.message).toStrictEqual('test error');
      expect(retryResponse.iteration).toStrictEqual(index + 1);
      expect(retryResponse.remaining).toStrictEqual(4 - index);
    });
    expect(errorResponses.length).toStrictEqual(1);
    errorResponses.forEach((errorResponse) => {
      expect(errorResponse.error.message).toStrictEqual('test error');
      expect(errorResponse.iteration).toStrictEqual(6);
      expect(errorResponse.remaining).toStrictEqual(0);
    });
  });
  it('Call safeRetry, fails every time, with custom retry-/errorHandler', async () => {
    const retryResponses = [];
    const errorResponses = [];
    const retryHandler = jest.fn((response) => retryResponses.push(response));
    const errorHandler = jest.fn((response) => errorResponses.push(response));
    const retryTimeoutClient = new RetryTimeoutClient({
      retryHandler,
      errorHandler,
    });
    const functionToCall = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error('test error'));
    }));
    await retryTimeoutClient.safeRetry(functionToCall, ['a', 1, 'b', 2]);
    expect(functionToCall).toBeCalledWith('a', 1, 'b', 2);
    expect(functionToCall).toBeCalledTimes(6);
    expect(retryHandler).toBeCalledTimes(5);
    expect(errorHandler).toBeCalledTimes(1);
    expect(retryResponses.length).toStrictEqual(5);
    retryResponses.forEach((retryResponse, index) => {
      expect(retryResponse.error.message).toStrictEqual('test error');
      expect(retryResponse.iteration).toStrictEqual(index + 1);
      expect(retryResponse.remaining).toStrictEqual(4 - index);
    });
    expect(errorResponses.length).toStrictEqual(1);
    errorResponses.forEach((errorResponse) => {
      expect(errorResponse.error.message).toStrictEqual('test error');
      expect(errorResponse.iteration).toStrictEqual(6);
      expect(errorResponse.remaining).toStrictEqual(0);
    });
  });
  it('Call retry client, times out two times, success on third attempt', async () => {
    const retryResponses = [];
    const errorHandler = jest.fn();
    const retryHandler = jest.fn((response) => retryResponses.push(response));
    const retryTimeoutClient = new RetryTimeoutClient({
      timeout: 500,
      retryHandler,
      errorHandler,
    });
    let counter = 0;
    const functionToCall = jest.fn(() => new Promise((resolve) => {
      counter += 1;
      if (counter >= 3) {
        resolve('success');
      } else {
        setTimeout(() => {
          resolve('success after 1 sec');
        }, 1000).unref();
      }
    }));
    const result = await retryTimeoutClient.retry(functionToCall, ['a', 1, 'b', 2]);
    expect(result).toStrictEqual('success');
    expect(functionToCall).toBeCalledWith('a', 1, 'b', 2);
    expect(functionToCall).toBeCalledTimes(3);
    expect(retryHandler).toBeCalledTimes(2);
    expect(errorHandler).toBeCalledTimes(0);
    expect(retryResponses[0].error.message).toStrictEqual('Timed out after 500 ms.');
    expect(retryResponses[1].error.message).toStrictEqual('Timed out after 500 ms.');
  });
});
