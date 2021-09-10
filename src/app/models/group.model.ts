import { BaseConfig } from "./base-config.model";

export class Group extends BaseConfig {
    public id: number;
    public name: string;

    constructor(init?: Partial<Group>) {
        super();
        this.id = this.notEmpty(init, 'id') ? init.id : new Date().getTime();
        this.name = this.notEmpty(init, 'name') ? init.name : '';
    }
}
