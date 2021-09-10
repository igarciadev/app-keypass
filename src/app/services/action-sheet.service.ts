import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ActionSheetController, AlertController } from '@ionic/angular';

import { PassConfig } from '../models/pass-config.model';

import { PassConfigService } from './pass-config.service';
import { StorageService } from './storage.service';

import text from 'src/assets/text/action-sheet.text.json';

@Injectable({
    providedIn: 'root'
})
export class ActionSheetService {

    ascending: boolean;
    passConfig: PassConfig;
    optionButtons: any[];
    sharedButtons: any[];
    navigateToView: string;
    navigateToEdit: string;
    text: any;

    constructor(
        private actionSheetController: ActionSheetController,
        private alertController: AlertController,
        private passConfigService: PassConfigService,
        private router: Router,
        private storageService: StorageService
    ) {
        this.navigateToView = '/tabs/safe-tab/view';
        this.navigateToEdit = '/tabs/safe-tab/edit';
        this.text = text;
    }

    createButtons(buttons: any[]): any[] {
        let result = [];
        for (let index in buttons) {
            let button = {
                text: buttons[index].text,
                icon: buttons[index].icon,
                role: buttons[index].role,
                cssClass: buttons[index].cssClass,
                handler: buttons[index].handler
            }
            result.push(button);
        }

        return result;
    }

    navigateTo(url: string): void {
        this.passConfigService.setPassConfig(this.passConfig);
        this.router.navigateByUrl(url);
    }

    viewAction(): void {
        this.navigateTo(this.navigateToView);
    }

    editAction(): void {
        this.navigateTo(this.navigateToEdit)
    }

    favoriteAction(passConfig?: PassConfig): Promise<string> {
        if (passConfig !== undefined) {
            this.passConfig = passConfig;
        }

        this.passConfig.favorite = !this.passConfig.favorite;

        this.storageService.updatePassConfig(this.passConfig);

        let resolveFunction: (confirm: string) => void;
        const promise = new Promise<string>(resolve => {
            resolveFunction = resolve;
        });

        resolveFunction('favoriteItem');

        return promise;
    }

    async deleteAction(passConfig?: PassConfig): Promise<string> {
        if (passConfig !== undefined) {
            this.passConfig = passConfig;
        }

        let resolveFunction: (confirm: string) => void;
        const promise = new Promise<string>(resolve => {
            resolveFunction = resolve;
        });

        const alert = await this.alertController.create({
            header: this.text.warningText,
            message: `${this.text.sureText}<br><br>${this.text.undoneText}`,
            buttons: [
                {
                    text: this.text.cancelText,
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: this.text.acceptText,
                    handler: () => {
                        if (passConfig !== undefined) {
                            this.router.navigateByUrl(`/tabs/safe-tab`);
                        }

                        this.storageService.removePassConfig(this.passConfig);
                        resolveFunction('deleteItem');
                    }
                }
            ]
        });

        await alert.present();
        return promise;
    }

    async mainActionSheet(passConfig: PassConfig): Promise<Promise<string>> {

        let resolveFunction: (confirm: Promise<string>) => void;
        const promise = new Promise<Promise<string>>(resolve => {
            resolveFunction = resolve;
        });

        this.passConfig = passConfig;

        this.optionButtons = [
            { text: this.text.viewText, icon: 'eye', handler: () => { this.viewAction(); } },
            { text: this.text.editText, icon: 'create', handler: () => { this.editAction(); } },
            { text: this.text.favoriteText, icon: 'heart', handler: () => { resolveFunction(this.favoriteAction()); }, cssClass: this.passConfig.favorite ? 'success' : '' },
            { text: this.text.deleteText, icon: 'trash', handler: () => { resolveFunction(this.deleteAction()); }, role: 'destructive', cssClass: 'danger' },
            { text: this.text.cancelText, icon: 'close', role: 'cancel' }
        ];

        const actionSheet = await this.actionSheetController.create({
            header: this.text.optionsText,
            buttons: this.createButtons(this.optionButtons)
        });

        await actionSheet.present();
        return promise;
    }
}
