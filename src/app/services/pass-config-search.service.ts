import { Injectable } from '@angular/core';

import { PassConfig } from '../models/pass-config.model';

import { PassConfigStorageService } from './pass-config-storage.service';
import { SortListService } from './sort-list.service';

@Injectable({
    providedIn: 'root'
})
export class PassConfigSearchService {

    list: PassConfig[];

    constructor(
        private passConfigStorageService: PassConfigStorageService,
        private sortListService: SortListService
    ) {
        this.init();
    }

    init(): void {
        this.list = [];
    }

    sort(): void {
        this.sortListService.sort(this.list, true);
    }

    removeItemFromList(passConfig: PassConfig): void {
        this.list = this.list.filter(f => f.id !== passConfig.id);
        this.sort();
    }

    async search(searchTerm) {
        if (!searchTerm) {
            searchTerm = undefined;
            this.init();
        } else {
            this.list = this.passConfigStorageService.findAll().filter(config => {
                if (config.name && searchTerm) {
                    return config.name.toLowerCase().includes(searchTerm.toLowerCase());
                }
            });
        }

        this.sort();

        return;
    }
}
