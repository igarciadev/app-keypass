import { Injectable } from '@angular/core';

import { BaseStorageService } from './base-storage.service';

import { Group } from '../models/group.model';

@Injectable({
    providedIn: 'root'
})
export class GroupStorageService extends BaseStorageService<Group> {

    groups: Group[] = [];

    constructor() {
        super();
    }

    init(): void {
        let groups = this.findAll();
        if (groups === null || groups.length === 0) {
            const group = new Group();
            group.name = 'Sin agrupar';

            this.saveAll([]);
            this.save(group);
        }
    }

    clear(): void {
        localStorage.clear();
        this.init();
    }

    load(): void {
        this.groups = JSON.parse(localStorage.getItem('groups'));
    }

    findAll(): Group[] {
        this.load();
        return this.groups;
    }

    findById(id: number): Group {
        return this.findAll().find(group => group.id === id);
    }

    findByName(name: string): Group {
        return this.groups.filter(group => group.name.toLowerCase() === name.toLowerCase())[0];
    }

    save(group: Group): Group[] {
        if (this.groups === null) {
            this.load();
        }

        this.groups.push(group);
        return this.saveAll(this.groups);
    }

    saveAll(groups: Group[]): Group[] {
        localStorage.setItem('groups', JSON.stringify(groups));
        return this.findAll();
    }

    update(groupNew: Group): Group[] {
        let groupOld = this.findById(groupNew.id);

        if (groupOld === null) {
            groupOld = groupNew;
        } else {
            groupOld.name = groupNew.name;
            this.delete(groupOld);
        }

        return this.save(groupOld);
    }

    delete(group: Group): Group[] {
        this.groups = this.groups.filter(f => f.id !== group.id);
        return this.saveAll(this.groups);
    }
}
