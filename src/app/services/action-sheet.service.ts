import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ActionSheetController, AlertController } from '@ionic/angular';

import { PassConfig } from '../models/pass-config.model';
import { FileService } from './file.service';
import { PassConfigFavoriteService } from './pass-config-favorite.service';
import { PassConfigListService } from './pass-config-list.service';
import { PassConfigService } from './pass-config.service';
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
        private fileService: FileService,
        private passConfigService: PassConfigService,
        private passConfigFavoriteService: PassConfigFavoriteService,
        private passConfigListService: PassConfigListService,
        private router: Router
    ) {
        this.navigateToView = '/tabs/safe-tab/view';
        this.navigateToEdit = '/tabs/safe-tab/edit';
        this.text = text;
    }

    navigateTo(url: string): void {
        this.passConfigService.setPassConfig(this.passConfig);
        this.router.navigateByUrl(url);
    }

    favoriteConfigAction(passConfig?: PassConfig): void {
        if (passConfig !== undefined) {
            this.passConfig = passConfig;
        }

        if (this.passConfigFavoriteService.listLength() < 3 && !this.passConfig.favorite) {
            this.passConfig.favorite = true;
            this.passConfigListService.removeItemFromList(this.passConfig);
            this.passConfigFavoriteService.addItemToList(this.passConfig);
        } else if (this.passConfig.favorite) {
            this.passConfig.favorite = false;
            this.passConfigListService.addItemToList(this.passConfig);
            this.passConfigFavoriteService.removeItemFromList(this.passConfig);
        } else if (!this.passConfig.favorite) {
            this.favoriteAlert();
        }
    }

    deletePassConfigAction(): void {
        this.passConfigListService.deletePassConfig(this.passConfig)
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

    async favoriteAlert() {
        const alert = await this.alertController.create({
            header: this.text.warningText,
            message: this.text.fullFavoriteText,
            buttons: [this.text.acceptText]
        });

        await alert.present();
    }

    async deleteConfigAlert(passConfig?: PassConfig) {
        if (passConfig !== undefined) {
            this.passConfig = passConfig;
        }

        const alert = await this.alertController.create({
            header: this.text.warningText,
            message: `${this.text.sureText}<br><strong>${this.text.undoneText}</strong>`,
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

                        this.deletePassConfigAction();
                    }
                }
            ]
        });

        await alert.present();
    }

    async mainActionSheet(passConfig: PassConfig) {
        this.passConfig = passConfig;

        this.optionButtons = [
            { text: this.text.viewText, icon: 'eye', handler: () => { this.navigateTo(this.navigateToView); } },
            { text: this.text.editText, icon: 'create', handler: () => { this.navigateTo(this.navigateToEdit); } },
            { text: this.text.favoriteText, icon: 'heart', handler: () => { this.favoriteConfigAction(); }, cssClass: this.passConfig.favorite ? 'success' : '' },
            { text: this.text.exportText, icon: 'document', handler: () => { this.fileService.exportToJsonFile(); } },
            { text: this.text.deleteText, icon: 'trash', handler: () => { this.deleteConfigAlert(); }, role: 'destructive', cssClass: 'danger' },
            { text: this.text.cancelText, icon: 'close', role: 'cancel' }
        ];

        const actionSheet = await this.actionSheetController.create({
            header: this.text.optionsText,
            buttons: this.createButtons(this.optionButtons)
        });

        await actionSheet.present();
        await actionSheet.onDidDismiss();
    }
}
