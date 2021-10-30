import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AlertController, Platform } from '@ionic/angular';

import { GroupStorageService } from './services/group-storage.service';
import { PassConfigStorageService } from './services/pass-config-storage.service';
import { UrlService } from './services/url.service';

import { Group } from './models/group.model';

import text from '../assets/text/app.text.json';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

    currentUrl: string;
    previousUrl: string;
    text: any;

    constructor(
        private alertController: AlertController,
        private groupStorageService: GroupStorageService,
        private location: Location,
        private platform: Platform,
        private router: Router,
        private passConfigStorageService: PassConfigStorageService,
        private urlService: UrlService,
    ) {
        this.currentUrl = null;
        this.previousUrl = null;
        this.text = text;
    }

    ngOnInit() {
        this.initializeApp();
        this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            this.previousUrl = this.currentUrl;
            this.currentUrl = event.url;
            this.urlService.setCurrentUrl(this.currentUrl);
            this.urlService.setPreviousUrl(this.previousUrl);
        });
    }

    initializeApp(): void {
        this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
            if (this.location.isCurrentPathEqualTo('/tabs/safe-tab')) {
                this.showExitConfirm();
                processNextHandler();
            } else {
                this.router.navigateByUrl('tabs/safe-tab', { replaceUrl: true });
            }
        });

        this.platform.backButton.subscribeWithPriority(5, () => {
            this.alertController.getTop().then(r => {
                if (r) {
                    navigator['app'].exitApp();
                }
            });
        });

        this.initializeGroups();

        const invalidKeyConfigs = this.countInvalidKeyConfigs();
        if (invalidKeyConfigs > 0) {
            this.createInvalidKeyConfigsAlert(invalidKeyConfigs);
        }
    }

    initializeGroups(): void {
        this.groupStorageService.init();
    }

    countInvalidKeyConfigs(): number {
        return this.passConfigStorageService.findAll().filter(passConfig => {
            if (passConfig.keyConfig.updatedOn) {
                const dateString = passConfig.keyConfig.updatedOn.replace(/:/g, '/').replace(' ', '/').split("/");
                const passConfigDate: Date = new Date(
                    Number(dateString[2]), Number(dateString[1]) - 1, Number(dateString[0]),
                    Number(dateString[3]), Number(dateString[4]), Number(dateString[5])
                );

                if (passConfigDate !== undefined) {
                    const nowDate: Date = new Date();
                    const daysBetweenDates: number = (passConfigDate.getTime() - nowDate.getTime()) / (1000 * 3600 * 24);

                    if (passConfig.security && daysBetweenDates <= 0) {
                        return passConfig;
                    }
                }
            }
        }).length;
    }

    async showExitConfirm() {
        const alert = await this.alertController.create({
            header: this.text.exitText,
            message: this.text.confirmText,
            backdropDismiss: false,
            buttons: [
                {
                    text: this.text.cancelText,
                    role: 'cancel'
                }, {
                    text: this.text.acceptText,
                    handler: () => {
                        navigator['app'].exitApp();
                    }
                }
            ]
        });

        await alert.present();
    }

    async createInvalidKeyConfigsAlert(invalidKeyConfigs: number) {
        let messageText: string = this.text.changeText;
        if (invalidKeyConfigs > 1) {
            messageText = this.text.changesText;
        }
        const alert = await this.alertController.create({
            header: this.text.expiredText,
            message: messageText,
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

        await alert.present();
    }
}
