const RetryExecutor = require('./src/services/retryExecutor');
const SettingsLoader = require('./src/services/settingsLoader');

/**
 * requestCallbackObject.
 * @typedef {Object} requestCallbackObject
 * @property {number} totalDuration number of ms since the start of the first attempt
 * @property {number} iterationDuration number of ms it took to execute this iteration
 * @property {number} iteration iteration number, indicating which n-th iteration it is.
 * @property {number} remaining remaining number of iterations before it fails.
 * @property {Error} error details of the error of this attempt
 */

/**
 * Function to call on failed attempt
 * @callback requestCallback
 * @param {requestCallbackObject} requestCallbackObject details of the attempt and error
 */

/**
 * SettingsObject.
 * @typedef {Object} SettingsObject
 * @property {requestCallback=} retryHandler function to be called on retry
 * @property {requestCallback=} errorHandler function to be called on error after last attempt
 * @property {number=} fixedBackOff fixed back off period (ms).
 * If provided a fixed back off period is used in between retry attempts.
 * Defaults to 0 (no fixed back off)
 * @property {number=} minimumBackOff minimum back off period (ms).
 * This back off period is used on first retry attempt. Defaults to 100.
 * @property {number=} backOffExponent exponent to be used to determine next back off period.
 * Defaults to 1.5.
 * @property {number=} maximumBackOff maximum back off period (ms).
 * Back off period will never exceed the provided value. Defaults to 10000.
 * @property {number=} maximumRetryCount maximum number of retries. Defaults to 5.
 * @property {number=} timeout maximum time allowed to resolve a single iteration (ms).
 * When provided an attempt to resolve functionToCall will be considered as failed if the
 * timeout is exceeded. Defaults to 0 (no timeout).
 */

class RetryClient {
  /**
   * Set retry client
   * @param {SettingsObject=} settings - object with settings
   */
  constructor(settings) {
    const settingsLoader = new SettingsLoader(settings);
    this.settings = settingsLoader.settings;
  }

  /**
   * Retry to call function.
   * @param {function} functionToCall function to retry.
   * @param {Array?} functionInput input parameters for function to call.
   * @returns {any} response of function to call after final attempt.
   */
  async retry(functionToCall, functionInput) {
    const retryExecutor = new RetryExecutor(this.settings);
    return retryExecutor.retry(functionToCall, functionInput);
  }

  /**
   * Safely retry to call function, when failed return null.
   * @param {function} functionToCall function to retry.
   * @param {Array?} functionInput input parameters for function to call.
   * @returns {any} response of function to call after final attempt or null if failed.
   */
  async safeRetry(functionToCall, functionInput) {
    try {
      const result = await this.retry(functionToCall, functionInput);
      return result;
    } catch (e) {
      return null;
    }
  }

  /**
   * Timeout to call function (single attempt to call functionToCall).
   * @param {function} functionToCall function to timeout.
   * @param {Array?} functionInput input parameters for function to call.
   * @returns {any} response of function to call after final attempt.
   */
  async timeout(functionToCall, functionInput) {
    const retryExecutor = new RetryExecutor({ ...this.settings, maximumRetryCount: 0 });
    return retryExecutor.retry(functionToCall, functionInput);
  }

  /**
   * Safely timeout to call function (single attempt to call functionToCall,
   * return null when failed).
   * @param {function} functionToCall function to timeout.
   * @param {Array?} functionInput input parameters for function to call.
   * @returns {any} response of function to call after final attempt.
   */
  async safeTimeout(functionToCall, functionInput) {
    try {
      const result = await this.timeout(functionToCall, functionInput);
      return result;
    } catch (e) {
      return null;
    }
  }
}

module.exports = RetryClient;
