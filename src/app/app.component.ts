import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AlertController, Platform } from '@ionic/angular';

import { StorageService } from './services/storage.service';
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
        private location: Location,
        private platform: Platform,
        private router: Router,
        private storageService: StorageService,
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
    }

    initializeGroups(): void {
        let groups = this.storageService.getGroups();
        if (groups === null || groups.length === 0) {
            const group = new Group();
            group.name = 'Sin agrupar';

            this.storageService.saveGroups([]);
            this.storageService.addGroup(group);
        }
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
}
