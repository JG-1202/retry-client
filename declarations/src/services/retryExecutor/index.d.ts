export = RetryExecutor;
declare class RetryExecutor {
    constructor(settings: any);
    settings: any;
    retryCount: number;
    delayer: Delayer;
    isMaximumReached(): boolean;
    callFunction(func: any, funcInput: any): Promise<any>;
    callRetryHandler(error: any): Promise<any>;
    callErrorHandler(error: any): Promise<any>;
    retry(func: any, funcInput: any): Promise<any>;
    startDt: number;
    iterationStartDt: number;
}
import Delayer = require("../delayer");
