/* eslint-disable max-lines-per-function */
/* eslint-disable no-undef */
const Delayer = require('../src/services/delayer');

const settings = {
  fixedBackOff: 5,
  minimumBackOff: 10,
  backOffExponent: 1.5,
  maximumBackOff: 100,
};

describe('Delayer', () => {
  it('Initiate', async () => {
    const delayer = new Delayer(settings);
    expect(delayer.settings.fixedBackOff).toStrictEqual(5);
  });
  it('fixedBackOff', async () => {
    const delayer = new Delayer(settings);
    const results = [
      delayer.getNextDelay(),
      delayer.getNextDelay(),
      delayer.getNextDelay(),
      delayer.getNextDelay(),
    ];
    expect(results).toStrictEqual([10, 15, 20, 25]);
  });
  it('fixedBackOff', async () => {
    const delayer = new Delayer({ ...settings, maximumBackOff: 20 });
    const results = [
      delayer.getNextDelay(),
      delayer.getNextDelay(),
      delayer.getNextDelay(),
      delayer.getNextDelay(),
    ];
    expect(results).toStrictEqual([10, 15, 20, 20]);
  });
  it('exponential increment', async () => {
    const delayer = new Delayer({ ...settings, fixedBackOff: 0 });
    const results = [
      delayer.getNextDelay(),
      delayer.getNextDelay(),
      delayer.getNextDelay(),
      delayer.getNextDelay(),
    ];
    expect(results).toStrictEqual([10, 15, 23, 35]);
  });
});
