import { Component, OnInit } from '@angular/core';

import { NavParams, PopoverController } from '@ionic/angular';

import text from 'src/assets/text/list-popover.component.text.json'

@Component({
    selector: 'app-list-popover',
    templateUrl: './list-popover.component.html'
})
export class ListPopoverComponent implements OnInit {

    ascending: boolean;
    page: string;
    text: any;

    constructor(
        private popoverController: PopoverController,
        private navParams: NavParams
    ) { }

    ngOnInit() {
        this.ascending = this.navParams.data.ascending;
        this.page = this.navParams.data.page;
        this.text = text;
    }

    dismissPopover(action: string) {
        this.popoverController.dismiss({
            item: { action: action }
        });
    }

    ascendingAction() {
        this.dismissPopover('ascending');
    }

    descendingAction() {
        this.dismissPopover('descending');
    }

    exportAction() {
        this.dismissPopover('export');
    }

    importAction() {
        this.dismissPopover('import');
    }

    get isAscending(): boolean {
        return this.ascending;
    }

    get showExportAction(): boolean {
        return this.page !== undefined && this.page === 'list-tab';
    }

    get showImportAction(): boolean {
        return this.page !== undefined && this.page === 'list-tab';
    }
}
