import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ActionSheetController, AlertController } from '@ionic/angular';

import { Group } from '../models/group.model';
import { PassConfig } from '../models/pass-config.model';

import { PassConfigService } from './pass-config.service';
import { StorageService } from './storage.service';

import text from 'src/assets/text/group-sheet.text.json';

@Injectable({
    providedIn: 'root'
})
export class GroupSheetService {

    ascending: boolean;
    passConfig: PassConfig;
    group: Group;
    optionButtons: any[];
    sharedButtons: any[];
    text: any;

    constructor(
        private actionSheetController: ActionSheetController,
        private alertController: AlertController,
        private passConfigService: PassConfigService,
        private router: Router,
        private storageService: StorageService
    ) {
        this.text = text;
    }

    navigateTo(url: string): void {
        this.passConfigService.setPassConfig(this.passConfig);
        this.router.navigateByUrl(url);
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

    async mainActionSheet(group: Group): Promise<Promise<any>> {

        let resolveFunction: (confirm: Promise<any>) => void;
        const promise = new Promise<Promise<any>>(resolve => {
            resolveFunction = resolve;
        });

        this.group = group;

        this.optionButtons = [
            { text: this.text.editText, icon: 'create', handler: () => { resolveFunction(this.editItem(group)); } },
            { text: this.text.deleteText, icon: 'trash', handler: () => { resolveFunction(this.deleteItem(group)); }, role: 'destructive', cssClass: 'danger' },
            { text: this.text.cancelText, icon: 'close', role: 'cancel' }
        ];

        const actionSheet = await this.actionSheetController.create({
            header: this.text.optionsText,
            buttons: this.createButtons(this.optionButtons)
        });

        await actionSheet.present();
        return promise;
    }

    async editItem(group: Group): Promise<any> {

        let resolveFunction: (confirm: any) => void;
        const promise = new Promise<any>(resolve => {
            resolveFunction = resolve;
        });

        const alert = await this.alertController.create({
            header: this.text.editText,
            inputs: [
                {
                    name: 'name',
                    value: group.name
                }
            ],
            buttons: [
                {
                    text: this.text.cancelText,
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: this.text.acceptText,
                    handler: (data: any) => {
                        group.name = data.name;
                        resolveFunction({ action: 'edit', group: group });
                    }
                }
            ]
        });

        await alert.present();
        return promise;
    }

    async deleteItem(group: Group): Promise<any> {
        let resolveFunction: (confirm: any) => void;
        const promise = new Promise<any>(resolve => {
            resolveFunction = resolve;
        });

        let alert;
        const existingGroupsLength = this.storageService.findPassConfigByGroupId(group.id).length;
        if (existingGroupsLength === 0) {
            alert = await this.alertController.create({
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
                            resolveFunction({ action: 'delete', group: group });
                        }
                    }
                ]
            });
        } else {
            const passConfigsText = existingGroupsLength > 1 ? this.text.manyText : this.text.oneText;
            alert = await this.alertController.create({
                header: this.text.deleteText,
                message: `${this.text.groupText} '${group.name}' ${this.text.notDeleteText}<br><br>${this.text.haveText} ${existingGroupsLength} ${passConfigsText}`,
                backdropDismiss: false,
                buttons: [
                    {
                        text: this.text.cancelText,
                        role: 'cancel'
                    }, {
                        text: this.text.acceptText,
                        role: 'ok'
                    }
                ]
            });
        }

        await alert.present();
        return promise;
    }
}
