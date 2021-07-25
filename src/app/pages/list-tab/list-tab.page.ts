import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PassConfig } from 'src/app/models/pass-config.model';
import { ActionSheetService } from 'src/app/services/action-sheet.service';
import { PassConfigFavoriteService } from 'src/app/services/pass-config-favorite.service';
import { PassConfigListService } from 'src/app/services/pass-config-list.service';
import text from 'src/assets/text/list-tab.text.json';

@Component({
    selector: 'app-list-tab',
    templateUrl: 'list-tab.page.html',
    styleUrls: ['list-tab.page.scss']
})
export class ListTabPage {

    toggleSort: boolean;
    toggleFavorite: boolean;
    searchIconClass: string;
    navigateToSearch: string;
    navigateToCreate: string;
    text: any;

    constructor(
        private actionSheetService: ActionSheetService,
        public passConfigListService: PassConfigListService,
        public passConfigFavoriteService: PassConfigFavoriteService,
        private router: Router
    ) {
        this.toggleSort = true;
        this.toggleFavorite = true;
        this.searchIconClass = 'rotate-90-plus';
        this.navigateToSearch = '/tabs/safe-tab/search';
        this.navigateToCreate = '/tabs/safe-tab/create';
        this.text = text;
    }

    ionViewWillEnter() {
        this.passConfigListService.init(this.toggleSort);
        this.passConfigFavoriteService.init();
    }

    navigateTo(url: string): void {
        this.router.navigateByUrl(url);
    }

    favoriteToggler(): void {
        this.toggleFavorite = !this.toggleFavorite;
    }

    sortToggler(): void {
        this.toggleSort = !this.toggleSort;
        this.searchIconClass = this.toggleSort ? 'rotate-90-plus' : 'rotate-90-minus';
        this.passConfigListService.sort(this.toggleSort);
    }

    callMainActionSheet(passConfig: PassConfig): Promise<void> {
        return this.actionSheetService.mainActionSheet(passConfig);
    }

    async processIfAvailable() {
        let itemsListLength = this.passConfigFavoriteService.listLength() + this.passConfigListService.listLength();
        if (itemsListLength !== this.passConfigListService.storageListLength()) {
            console.log('showIfAvailable');
            this.passConfigListService.reload();
        }
    }

    get showFavoriteList(): boolean {
        return this.passConfigFavoriteService.listLength() > 0;
    }
}
