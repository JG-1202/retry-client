/* eslint-disable max-lines-per-function */
/* eslint-disable no-undef */
const RetryTimeoutClient = require('../index');

describe('Retry', () => {
  it('Call timeout client successful resolve', async () => {
    const retryTimeoutClient = new RetryTimeoutClient({ timeout: 3000 });
    const functionToCall = jest.fn(() => new Promise((resolve) => {
      resolve('success');
    }));
    const result = await retryTimeoutClient.timeout(functionToCall, ['a', 1, 'b', 2]);
    expect(result).toStrictEqual('success');
    expect(functionToCall).toBeCalledWith('a', 1, 'b', 2);
    expect(functionToCall).toBeCalledTimes(1);
  });
  it('Call timeout client function timed out', async () => {
    const retryTimeoutClient = new RetryTimeoutClient({ timeout: 3000 });
    const functionToCall = jest.fn(() => new Promise((resolve) => {
      setTimeout(() => {
        resolve('Success.');
      }, 10000).unref();
    }));
    let errorMessage = null;
    try {
      await retryTimeoutClient.timeout(functionToCall, ['a', 1]);
    } catch (err) {
      errorMessage = err.message;
    }
    expect(errorMessage).toStrictEqual('Timed out after 3000 ms.');
    expect(functionToCall).toBeCalledWith('a', 1);
    expect(functionToCall).toBeCalledTimes(1);
  });
});
