import { Injectable } from '@angular/core';

import { PassConfig } from '../models/pass-config.model';
import { SortListService } from './sort-list.service';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class PassConfigFavoriteService {

    list: PassConfig[];

    constructor(
        private sortListService: SortListService,
        private storageService: StorageService
    ) {
        this.init();
    }

    init(): void {
        this.fillList();
        this.sortListService.sortAscending(this.list);
    }

    fillList(): void {
        this.list = [];
        this.storageService.getData().forEach(item => {
            if (item.name === '' || (item.keyConfig !== undefined && item.keyConfig.keyword === '')) {
                this.storageService.removePassConfig(item);
            }
            if (item.favorite) {
                this.list.push(item);
            }
        });
    }

    addItemToList(passConfig: PassConfig): void {
        this.list.push(passConfig);
        this.sortListService.sortAscending(this.list);
    }

    removeItemFromList(passConfig: PassConfig): void {
        this.list = this.list.filter(f => f.id !== passConfig.id);
        this.sortListService.sortAscending(this.list);
    }

    listLength(): number {
        return this.list.length;
    }
}
