/* eslint-disable max-lines-per-function */
/* eslint-disable no-undef */
const RetryClient = require('../index');

describe('Retry', () => {
  it('Call retry client, success on first attempt', async () => {
    const retryClient = new RetryClient();
    const functionToCall = jest.fn(() => new Promise((resolve) => {
      resolve('success');
    }));
    const result = await retryClient.retry(functionToCall, ['a', 1, 'b', 2]);
    expect(result).toStrictEqual('success');
    expect(functionToCall).toBeCalledWith('a', 1, 'b', 2);
    expect(functionToCall).toBeCalledTimes(1);
  });
  it('Call retry client, success on third attempt', async () => {
    const retryHandler = jest.fn();
    const errorHandler = jest.fn();
    const retryClient = new RetryClient({
      retryHandler,
      errorHandler,
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
    const result = await retryClient.retry(functionToCall, ['a', 1, 'b', 2]);
    expect(result).toStrictEqual('success');
    expect(functionToCall).toBeCalledWith('a', 1, 'b', 2);
    expect(functionToCall).toBeCalledTimes(3);
    expect(retryHandler).toBeCalledTimes(2);
    expect(errorHandler).toBeCalledTimes(0);
  });
  it('Call retry client, fails every time', async () => {
    const retryClient = new RetryClient();
    const functionToCall = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error('error'));
    }));
    let errorMessage = null;
    try {
      await retryClient.retry(functionToCall, ['a']);
    } catch (err) {
      errorMessage = err.message;
    }
    expect(errorMessage).toStrictEqual('error');
    expect(functionToCall).toBeCalledWith('a');
    expect(functionToCall).toBeCalledTimes(6);
  });
  it('Call retry client, fails every time, with custom retry-/errorHandler', async () => {
    const retryHandler = jest.fn();
    const errorHandler = jest.fn();
    const retryClient = new RetryClient({
      retryHandler,
      errorHandler,
    });
    const functionToCall = jest.fn(() => new Promise((resolve, reject) => {
      reject(new Error('error'));
    }));
    let errorMessage = null;
    try {
      await retryClient.retry(functionToCall, ['a', 1, 'b', 2]);
    } catch (err) {
      errorMessage = err.message;
    }
    expect(errorMessage).toStrictEqual('error');
    expect(functionToCall).toBeCalledWith('a', 1, 'b', 2);
    expect(functionToCall).toBeCalledTimes(6);
    expect(retryHandler).toBeCalledTimes(5);
    expect(errorHandler).toBeCalledTimes(1);
  });
});
