/* eslint-disable max-lines-per-function */
/* eslint-disable no-undef */
const RetryTimeoutClient = require('../index');

describe('Retry', () => {
  it('Call retry client, success on first attempt', async () => {
    const retryTimeoutClient = new RetryTimeoutClient({ timeout: 3000 });
    const functionToCall = jest.fn(() => new Promise((resolve) => {
      resolve('success');
    }));
    const result = await retryTimeoutClient.retryTimeout(functionToCall, ['a', 1, 'b', 2]);
    expect(result).toStrictEqual('success');
    expect(functionToCall).toBeCalledWith('a', 1, 'b', 2);
    expect(functionToCall).toBeCalledTimes(1);
  });
  it('Call retry client, fails, but times out after 2nd attempt', async () => {
    const retryTimeoutClient = new RetryTimeoutClient({ timeout: 3000 });
    const functionToCall = jest.fn(() => new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Failed'));
      }, 2000).unref();
    }));
    let errorMessage = null;
    try {
      await retryTimeoutClient.retryTimeout(functionToCall, ['a', 1, 'b', 2]);
    } catch (err) {
      errorMessage = err.message;
    }
    expect(errorMessage).toStrictEqual('Timed out after 3000 ms.');
    expect(functionToCall).toBeCalledWith('a', 1, 'b', 2);
    expect(functionToCall).toBeCalledTimes(2);
  });
});
