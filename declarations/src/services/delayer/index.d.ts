export = Delayer;
declare class Delayer {
    constructor(settings: any);
    settings: any;
    lastDelay: number;
    getNextDelay(): number;
    delay(): Promise<any>;
}
