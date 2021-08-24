import { Injectable } from '@angular/core';

import { PassConfigFavoriteService } from './pass-config-favorite.service';
import { PassConfigSearchService } from './pass-config-search.service';
import { PassConfig } from '../models/pass-config.model';
import { SortListService } from './sort-list.service';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class PassConfigListService {

    ascending: boolean;
    list: PassConfig[];

    constructor(
        private passConfigFavoritesService: PassConfigFavoriteService,
        private passConfigSearchService: PassConfigSearchService,
        private sortListService: SortListService,
        private storageService: StorageService
    ) {
        this.init();
        this.ascending = true;
    }

    init(ascending?: boolean): void {
        this.fillList();
        if (ascending === undefined) {
            ascending = true;
        }

        this.sortListService.sort(this.list, ascending);
    }

    reload(): void {
        this.fillList();
        this.sortListService.sort(this.list, this.ascending);
    }

    fillList(): void {
        this.list = [];
        this.storageService.getData().forEach(item => {
            if (item.name === '' || (item.keyConfig !== undefined && item.keyConfig.keyword === '')) {
                this.storageService.removePassConfig(item);
            }
            if (!item.favorite) {
                this.list.push(item);
            }
        });
    }

    sort(ascending: boolean): void {
        this.ascending = ascending;
        this.sortListService.sort(this.list, ascending);
    }

    addItemToList(passConfig: PassConfig): void {
        this.list.push(passConfig);
        this.storageService.updatePassConfig(passConfig);
        this.sortListService.sort(this.list, this.ascending);
    }

    removeItemFromList(passConfig: PassConfig): void {
        this.list = this.list.filter(f => f.id !== passConfig.id);
        this.storageService.updatePassConfig(passConfig);
        this.sortListService.sort(this.list, this.ascending);
    }

    deletePassConfig(passConfig: PassConfig): void {
        this.storageService.removePassConfig(passConfig);
        this.reload();
        this.passConfigFavoritesService.init();
        this.passConfigSearchService.removeItemFromList(passConfig);
    }
}
