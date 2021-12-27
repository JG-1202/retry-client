# retry-client
[![codefactor](https://img.shields.io/codefactor/grade/github/JG-1202/retry-client?color=2e7dcc&logo=codefactor&logoColor=ffffff&style=for-the-badge)](https://www.codefactor.io/repository/github/jg-1202/retry-client)
[![npmSize](https://img.shields.io/bundlephobia/min/retry-client?color=2e7dcc&style=for-the-badge)](https://bundlephobia.com/result?p=retry-client)
[![codecov](https://img.shields.io/codecov/c/github/JG-1202/retry-client?color=2e7dcc&logo=codecov&logoColor=ffffff&style=for-the-badge&token=OFQFOTBOZY)](https://codecov.io/gh/JG-1202/retry-client)
[![downloads](https://img.shields.io/npm/dw/retry-client?color=2e7dcc&style=for-the-badge)](https://www.npmjs.com/package/retry-client)
[![maintainability](https://img.shields.io/codeclimate/maintainability/JG-1202/retry-client?color=2e7dcc&logo=code-climate&logoColor=ffffff&style=for-the-badge)](https://codeclimate.com/github/JG-1202/retry-client)


Client that retries any function until no error is thrown and (if desired) function did not timeout. 
Alternatively, a timeout can be set for a single attempt to resolve the function. 

## Installation

Use npm to install retry-client.

```bash
npm install retry-client
```

## Usage
Retry-client can be used according to its JSDocs definition. Initiate retry-client once and call `retry` to retry to resolve a function or `timeout` to try to resolve within timeout period.

```javascript
const RetryClient = require('retry-client');
const settings = {}; // see below to see available settings
const retryClient = new RetryClient(settings);
```

### new RetryClient(settings)
Initiate RetryClient once. `retry` and `timeout` will use the settings provided in `RetryClient`.
The following `settings` can be passed into the `settings` object:
 * `retryHandler` (function) function to be called on retry. Defaults to `() => null`.
 * `errorHandler` (function) function to be called on error after last attempt. Defaults to `() => null`.
 * `fixedBackOff` (number) fixed back off period (ms). If provided a fixed back off period is used in between retry attempts. Defaults to `0` (no fixed back off)
 * `minimumBackOff` (number) minimum back off period (ms). This back off period is used on first retry attempt. Defaults to `100`.
 * `backOffExponent` (number) exponent to be used to determine next back off period. Defaults to `1.5`.
 * `maximumBackOff` (number) maximum back off period (ms). Back off period will never exceed the provided value. Defaults to `10000`.
 * `maximumRetryCount` (number) maximum number of retries. Defaults to `5`.
 * `timeout` (number) maximum time allowed to resolve a single iteration (ms). When provided an attempt to resolve functionToCall will be considered as failed if the timeout is exceeded. Defaults to `0` (no timeout).
 
Both `retryHandler` and `errorHandler` will receive the following input when called:
```javascript
{
  totalDuration: Number, // milliseconds
  iterationDuration: Number, // milliseconds
  iteration: Number, // iteration counter
  remaining: Number, // remaining iterations
  error: Error // details of the error of the regarding iteration
}
```

#### retryClient.retry(functionToCall, functionInput)
Attempts to successfully resolve `functionToCall` with the provided `functionInput`. Stops retrying when function resolved successfully once.

Example:
```javascript
const RetryClient = require('retry-client');
const settings = { maximumRetryCount: 3 };
const retryClient = new RetryClient(settings);
const functionToCall = (inputA, inputB, inputC) => {
  //do something
  return `${inputA} - ${inputB} - ${inputC}`;
};
const result = retryClient.retry(functionToCall, ['A', 'B', 'C']);
```

If successfully resolved within 3 retries, result is:
`'A - B - C'`
Otherwise error of last attempt is thrown.

#### retryClient.safeRetry(functionToCall, functionInput)
Attempts to successfully resolve `functionToCall` with the provided `functionInput`. Stops retrying when function resolved successfully once. Returns `null` when last attempt failed.

Example:
```javascript
const RetryClient = require('retry-client');
const settings = { maximumRetryCount: 3 };
const retryClient = new RetryClient(settings);
const functionToCall = (inputA, inputB, inputC) => {
  //do something
  return `${inputA} - ${inputB} - ${inputC}`;
};
const result = retryClient.safeRetry(functionToCall, ['A', 'B', 'C']);
```

If successfully resolved within 3 retries, result is:
`'A - B - C'`
Otherwise return `null`.

#### retryClient.timeout(functionToCall, functionInput)
Attempts to successfully resolve `functionToCall` with the provided `functionInput` within the provided `timeout` (setting).

Example:
```javascript
const RetryClient = require('retry-client');
const settings = { timeout: 1000 };
const retryClient = new RetryClient(settings);
const functionToCall = (inputA, inputB, inputC) => {
  //do something
  return `${inputA} - ${inputB} - ${inputC}`;
};
const result = retryClient.timeout(functionToCall, ['A', 'B', 'C']);
```

If successfully resolved within 1000 ms, result is:
`'A - B - C'`
Otherwise the following error is thrown: `Timed out after 1000 ms.`

#### retryClient.safeTimeout(functionToCall, functionInput)
Attempts to successfully resolve `functionToCall` with the provided `functionInput` within the provided `timeout` (setting). When not resolved the function returns `null`.

Example:
```javascript
const RetryClient = require('retry-client');
const settings = { timeout: 1000 };
const retryClient = new RetryClient(settings);
const functionToCall = (inputA, inputB, inputC) => {
  //do something
  return `${inputA} - ${inputB} - ${inputC}`;
};
const result = retryClient.safeTimeout(functionToCall, ['A', 'B', 'C']);
```

If successfully resolved within 1000 ms, result is:
`'A - B - C'`
Otherwise return `null`.