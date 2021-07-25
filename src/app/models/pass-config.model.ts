import { BaseConfig } from 'src/app/models/base-config.model';
import { KeyConfig } from 'src/app/models/key-config.model';

export class PassConfig extends BaseConfig {
    public id: number;
    public name: string;
    public username: string;
    public uri: string;
    public notes: string;
    public image: string;
    public favorite: boolean;
    public createdOn: string;
    public updatedOn: string;
    public keyConfig: KeyConfig;

    constructor(init?: Partial<PassConfig>) {
        super();
        this.id = this.notEmpty(init, 'id') ? init.id : new Date().getTime();
        this.name = this.notEmpty(init, 'name') ? init.name : '';
        this.username = this.notEmpty(init, 'username') ? init.username : '';
        this.uri = this.notEmpty(init, 'uri') ? init.uri : '';
        this.notes = this.notEmpty(init, 'notes') ? init.notes : '';
        this.image = this.notEmpty(init, 'image') ? this.buildImage(init.uri) : '';
        this.favorite = this.notEmpty(init, 'favorite') ? init.favorite : false;
        this.createdOn = this.notEmpty(init, 'createdOn') ? init.createdOn : this.timeCore.getNow();
        this.updatedOn = this.notEmpty(init, 'updatedOn') ? init.updatedOn : this.timeCore.getNow();
        this.keyConfig = this.notEmpty(init, 'keyConfig') ? new KeyConfig(init.keyConfig) : new KeyConfig();
    }

    buildImage(uri: string): string {
        const url = uri.match(/[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/);
        return `https://www.google.com/s2/favicons?sz=32&domain_url=${url}`;
    }

    update(passConfig: PassConfig): void {
        this.name = passConfig.name;
        this.username = passConfig.username;
        this.uri = passConfig.uri;
        this.notes = passConfig.notes;
    }

    equals(passConfig: PassConfig): boolean {
        return this.name === passConfig.name &&
            this.username === passConfig.username &&
            this.uri === passConfig.uri &&
            this.notes === passConfig.notes &&
            this.image === passConfig.image;
    }
}
