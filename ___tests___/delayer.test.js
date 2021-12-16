/* eslint-disable max-lines-per-function */
/* eslint-disable no-undef */
const Delayer = require('../src/services/delayer');

const settings = {
  fixedDelayIncrement: 5,
  minimumDelay: 10,
  delayExponent: 1.5,
  maximumDelay: 100,
};

describe('Delayer', () => {
  it('Initiate', async () => {
    const delayer = new Delayer({ settings });
    expect(delayer.settings.fixedDelayIncrement).toStrictEqual(5);
  });
  it('fixedDelayIncrement', async () => {
    const delayer = new Delayer({ settings });
    const results = [
      delayer.getNextDelay(),
      delayer.getNextDelay(),
      delayer.getNextDelay(),
      delayer.getNextDelay(),
    ];
    expect(results).toStrictEqual([10, 15, 20, 25]);
  });
  it('fixedDelayIncrement', async () => {
    const delayer = new Delayer({ settings: { ...settings, maximumDelay: 20 } });
    const results = [
      delayer.getNextDelay(),
      delayer.getNextDelay(),
      delayer.getNextDelay(),
      delayer.getNextDelay(),
    ];
    expect(results).toStrictEqual([10, 15, 20, 20]);
  });
  it('exponential increment', async () => {
    const delayer = new Delayer({ settings: { ...settings, fixedDelayIncrement: 0 } });
    const results = [
      delayer.getNextDelay(),
      delayer.getNextDelay(),
      delayer.getNextDelay(),
      delayer.getNextDelay(),
    ];
    expect(results).toStrictEqual([10, 15, 23, 35]);
  });
});
