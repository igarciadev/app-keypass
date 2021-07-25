import { TimeCore } from "../core/time.core";

export class BaseConfig {

    timeCore: TimeCore;

    constructor() {
        this.timeCore = new TimeCore();
    }

    notEmpty(init: any, field: string): boolean {
        return init !== undefined && init[field] !== null;
    }
}
