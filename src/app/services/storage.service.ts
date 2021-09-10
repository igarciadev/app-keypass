import { Injectable } from '@angular/core';

import { TimeCore } from '../core/time.core';
import { Group } from '../models/group.model';
import { PassConfig } from '../models/pass-config.model';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    passConfigs: PassConfig[] = [];
    groups: Group[] = [];
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

    loadGroups(): void {
        this.groups = JSON.parse(localStorage.getItem('groups'));
    }

    getData(): PassConfig[] {
        return this.passConfigs;
    }

    getGroups(): Group[] {
        this.loadGroups();
        return this.groups;
    }

    saveData(passConfigs: PassConfig[]): void {
        localStorage.setItem('data', JSON.stringify(passConfigs));
    }

    saveGroups(groups: Group[]): void {
        localStorage.setItem('groups', JSON.stringify(groups));
    }

    addPassConfig(passConfig: PassConfig): void {
        if (this.passConfigs === null) {
            this.loadData();
        }
        passConfig.updatedOn = this.timeCore.forModel();
        this.passConfigs.push(passConfig);
        this.saveData(this.passConfigs);
    }

    addGroup(group: Group): Group[] {
        if (this.groups === null) {
            this.loadGroups();
        }
        this.groups.push(group);
        this.saveGroups(this.groups);

        return this.getGroups();
    }

    findPassConfigByGroupId(groupId: number): PassConfig[] {
        return this.passConfigs.filter(passConfig => passConfig.group.id === groupId);
    }

    findFavoritePassConfigs(): PassConfig[] {
        return this.passConfigs.filter(passConfig => passConfig.favorite === true);
    }

    findGroupById(id: number): Group {
        return this.getGroups().find(group => group.id === id);
    }

    findGroupByName(name: string): Group {
        return this.groups.filter(group => group.name.toLowerCase() === name.toLowerCase())[0];
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

    updateGroup(groupNew: Group): Group[] {
        let groupOld = this.findGroupById(groupNew.id);

        if (groupOld === null) {
            groupOld = groupNew;
        } else {
            groupOld.name = groupNew.name;
            this.removeGroup(groupOld);
        }

        return this.addGroup(groupOld);
    }

    removePassConfig(passConfig: PassConfig): void {
        this.passConfigs = this.passConfigs.filter(f => f.id !== passConfig.id);
        this.saveData(this.passConfigs);
    }

    removeGroup(group: Group): Group[] {
        this.groups = this.groups.filter(f => f.id !== group.id);
        this.saveGroups(this.groups);

        return this.getGroups();
    }
}
