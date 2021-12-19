export = SettingsLoader;
declare class SettingsLoader {
    constructor(settings: any);
    settings: {};
    setSetting({ settingName, settingValue, settingDefault }: {
        settingName: any;
        settingValue: any;
        settingDefault: any;
    }): void;
    loadSettings(userSettings: any): void;
}
