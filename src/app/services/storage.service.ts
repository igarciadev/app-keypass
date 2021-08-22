import { Injectable } from '@angular/core';

import { TimeCore } from '../core/time.core';
import { PassConfig } from '../models/pass-config.model';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    passConfigs: PassConfig[] = [];
    timeCore: TimeCore;

    constructor() {
        this.loadData();
        this.timeCore = new TimeCore();
    }

    loadData(): void {
        if (localStorage.getItem('data')) {
            let data = JSON.parse(localStorage.getItem('data'));
            data.map(passConfig => {
                this.passConfigs.push(new PassConfig(passConfig));
            });
        }
    }

    getData(): PassConfig[] {
        return this.passConfigs;
    }

    saveData(passConfigs: PassConfig[]): void {
        localStorage.setItem('data', JSON.stringify(passConfigs));
    }

    addPassConfig(passConfig: PassConfig): void {
        passConfig.updatedOn = this.timeCore.forModel();
        this.passConfigs.push(passConfig);
        this.saveData(this.passConfigs);
    }

    getPassConfig(id: number): PassConfig {
        let passConfigStored = this.passConfigs.find(passConfig => passConfig.id === id);

        if (passConfigStored !== undefined) {
            passConfigStored = new PassConfig(passConfigStored);
            return passConfigStored;
        }

        return null;
    }

    updatePassConfig(passConfigNew: PassConfig): void {
        let passConfigOld = this.getPassConfig(passConfigNew.id);

        if (passConfigOld === null) {
            passConfigOld = passConfigNew;
        } else {
            passConfigOld.update(passConfigNew);
            passConfigOld.buildImage(passConfigNew.uri);
            passConfigOld.favorite = passConfigNew.favorite;
            passConfigOld.keyConfig.update(passConfigNew.keyConfig);
            passConfigOld.keyConfig = passConfigNew.keyConfig ? passConfigNew.keyConfig : passConfigOld.keyConfig;

            this.removePassConfig(passConfigOld);
        }

        this.addPassConfig(passConfigOld);
    }

    removePassConfig(passConfig: PassConfig): void {
        this.passConfigs = this.passConfigs.filter(f => f.id !== passConfig.id);
        this.saveData(this.passConfigs);
    }
}
