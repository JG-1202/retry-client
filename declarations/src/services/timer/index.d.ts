export = Timer;
declare class Timer {
    constructor(settings: any);
    settings: any;
    setTimer(): Promise<any>;
    id: NodeJS.Timeout;
    stopTimer(): void;
}
