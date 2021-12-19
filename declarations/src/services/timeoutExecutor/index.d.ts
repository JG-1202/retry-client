export = TimeoutExecutor;
declare class TimeoutExecutor {
    constructor(settings: any);
    settings: any;
    timeout(func: any, funcInput: any): Promise<any>;
    startDt: number;
}
