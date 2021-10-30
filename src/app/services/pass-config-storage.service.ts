import { Injectable } from '@angular/core';

import { TimeCore } from '../core/time.core';
import { BaseStorageService } from './base-storage.service';

import { PassConfig } from '../models/pass-config.model';

@Injectable({
    providedIn: 'root'
})
export class PassConfigStorageService extends BaseStorageService<PassConfig> {

    passConfigs: PassConfig[] = [];
    timeCore: TimeCore;

    constructor() {
        super();
        this.load();
        this.timeCore = new TimeCore();
    }

    clear(): void {
        this.findAll().forEach(passConfig => {
            this.delete(passConfig);
        });
    }

    load(): void {
        if (localStorage.getItem('passConfigs')) {
            let data = JSON.parse(localStorage.getItem('passConfigs'));
            data.map(passConfig => {
                this.passConfigs.push(new PassConfig(passConfig));
            });
        }
    }

    findAll(): PassConfig[] {
        return this.passConfigs;
    }

    findById(id: number): PassConfig {
        if (this.passConfigs.length === 0) {
            this.load();
        }

        let passConfigStored = this.passConfigs.find(passConfig => passConfig.id === id);
        if (passConfigStored !== undefined) {
            passConfigStored = new PassConfig(passConfigStored);
            return passConfigStored;
        }

        return null;
    }

    findByGroupId(groupId: number): PassConfig[] {
        return this.passConfigs.filter(passConfig => passConfig.group.id === groupId);
    }

    findByFavorite(): PassConfig[] {
        return this.passConfigs.filter(passConfig => passConfig.favorite === true);
    }

    save(passConfig: PassConfig): PassConfig[] {
        if (this.passConfigs === null) {
            this.load();
        }

        passConfig.updatedOn = this.timeCore.forModel();
        this.passConfigs.push(passConfig);
        return this.saveAll(this.passConfigs);
    }

    saveAll(passConfigs: PassConfig[]): PassConfig[] {
        localStorage.setItem('passConfigs', JSON.stringify(passConfigs));
        return this.findAll();
    }

    update(passConfigNew: PassConfig): PassConfig[] {
        let passConfigOld = this.findById(passConfigNew.id);

        if (passConfigOld === null) {
            passConfigOld = passConfigNew;
        } else {
            passConfigOld.update(passConfigNew);
            passConfigOld.buildImage(passConfigNew.uri);
            passConfigOld.favorite = passConfigNew.favorite;
            passConfigOld.keyConfig.update(passConfigNew.keyConfig);
            passConfigOld.keyConfig = passConfigNew.keyConfig ? passConfigNew.keyConfig : passConfigOld.keyConfig;

            this.delete(passConfigOld);
        }

        return this.save(passConfigOld);
    }

    delete(passConfig: PassConfig): PassConfig[] {
        this.passConfigs = this.passConfigs.filter(f => f.id !== passConfig.id);
        return this.saveAll(this.passConfigs);
    }
}
