import { Component, OnInit } from '@angular/core';

import { NavParams, PopoverController } from '@ionic/angular';

import { PassConfig } from 'src/app/models/pass-config.model';
import text from 'src/assets/text/action-popover.component.text.json'

@Component({
    selector: 'app-popover-view',
    templateUrl: './action-popover.component.html'
})
export class ActionPopoverComponent implements OnInit {

    page: string;
    passConfig: PassConfig;
    text: any;

    constructor(
        private popoverController: PopoverController,
        private navParams: NavParams
    ) { }

    ngOnInit() {
        this.page = this.navParams.data.page;
        this.passConfig = this.navParams.data.passcConfig;
        this.text = text;
    }

    dismissPopover(action: string, passConfig: PassConfig) {
        this.popoverController.dismiss({
            item: { action: action, passConfig: passConfig }
        });
    }

    editConfigPassAction() {
        this.dismissPopover('edit', this.passConfig);
    }

    favoriteConfigAction() {
        this.dismissPopover('favorite', this.passConfig);
    }

    exportConfigPassAction() {
        this.dismissPopover('export', this.passConfig);
    }

    deleteConfigPassAction() {
        this.dismissPopover('delete', this.passConfig);
    }
}
