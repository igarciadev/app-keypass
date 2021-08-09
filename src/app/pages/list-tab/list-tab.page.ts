import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PopoverController } from '@ionic/angular';

import { PassConfig } from 'src/app/models/pass-config.model';
import { ActionSheetService } from 'src/app/services/action-sheet.service';
import { FileService } from 'src/app/services/file.service';
import { PassConfigFavoriteService } from 'src/app/services/pass-config-favorite.service';
import { PassConfigListService } from 'src/app/services/pass-config-list.service';
import { ListPopoverComponent } from 'src/app/shared/list-popover/list-popover/list-popover.component';
import text from 'src/assets/text/list-tab.text.json';

@Component({
    selector: 'app-list-tab',
    templateUrl: 'list-tab.page.html',
    styleUrls: ['list-tab.page.scss']
})
export class ListTabPage {

    toggleSort: boolean;
    toggleFavorite: boolean;
    navigateToSearch: string;
    navigateToCreate: string;
    text: any;

    constructor(
        private actionSheetService: ActionSheetService,
        private fileService: FileService,
        public passConfigListService: PassConfigListService,
        public passConfigFavoriteService: PassConfigFavoriteService,
        private popoverController: PopoverController,
        private router: Router
    ) {
        this.toggleSort = true;
        this.toggleFavorite = true;
        this.navigateToSearch = '/tabs/safe-tab/search';
        this.navigateToCreate = '/tabs/safe-tab/create';
        this.text = text;
    }

    ionViewWillEnter() {
        this.passConfigListService.init(this.toggleSort);
        this.passConfigFavoriteService.init();
        this.reloadLists();
    }

    reloadLists() {
        let itemsListLength = this.passConfigFavoriteService.listLength() + this.passConfigListService.listLength();
        if (itemsListLength !== this.passConfigListService.storageListLength()) {
            this.passConfigListService.reload();
        }
    }

    navigateTo(url: string): void {
        this.router.navigateByUrl(url);
    }

    favoriteToggler(): void {
        this.toggleFavorite = !this.toggleFavorite;
    }

    sortToggler(ascending: boolean): void {
        this.toggleSort = ascending;
        this.passConfigListService.sort(this.toggleSort);
    }

    callMainActionSheet(passConfig: PassConfig): Promise<void> {
        return this.actionSheetService.mainActionSheet(passConfig);
    }

    async listPopover(event: any) {
        const popover = await this.popoverController.create({
            component: ListPopoverComponent,
            event: event,
            translucent: true,
            componentProps: { ascending: this.toggleSort }
        });

        await popover.present();

        const { data } = await popover.onDidDismiss();

        switch (data !== undefined && data.item.action) {
            case 'ascending':
                this.sortToggler(true);
                break;
            case 'descending':
                this.sortToggler(false);
                break;
            case 'export':
                this.fileService.exportToJsonFile();
                break;
            case 'import':
                this.fileService.importFormJsonFile();
                break;
            default:
                break;
        }
    }

    get showFavoriteList(): boolean {
        return this.passConfigFavoriteService.listLength() > 0;
    }
}
