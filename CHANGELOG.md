# Changelog
All notable changes to this project will be documented here.

## [1.2.0] - 2022-02-04
### Changed
- bugfix where delayer stopt at end of execution, potentially resulting into missing retries
- allowing to call function without function input

## [1.1.0] - 2021-12-27
### Added
- safeRetry
- safeTimeout

## [1.0.0] - 2021-12-19
### Added
- retry
- timeout
- settings; retryHandler, errorHandler, fixedBackOff, minimumBackOff, backOffExponent, maximumBackOff, maximumRetryCount, timeout