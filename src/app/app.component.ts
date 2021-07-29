import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AlertController, Platform } from '@ionic/angular';

import { FileService } from './services/file.service';
import { InitializerService } from './services/initializer.service';
import { StorageService } from './services/storage.service';
import { UrlService } from './services/url.service';
import { environment } from './../environments/environment';
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
        private fileService: FileService,
        private initializerService: InitializerService,
        private location: Location,
        private platform: Platform,
        private router: Router,
        private storageService: StorageService,
        private urlService: UrlService,
    ) {
        this.currentUrl = null;
        this.previousUrl = null;
        this.text = text;

        if (!environment.production && storageService.getData().length === 0) {
            initializerService.addSampleData();
        }
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
                this.location.back();
            }
        });

        this.platform.backButton.subscribeWithPriority(5, () => {
            this.alertController.getTop().then(r => {
                if (r) {
                    navigator['app'].exitApp();
                }
            }).catch(e => {
                console.log(e);
            })
        });
    }

    exportData() {
        this.fileService.exportToJsonFile();
    }

    importData() {
        this.fileService.importFormJsonFile();
    }

    async showExitConfirm() {
        const alert = await this.alertController.create({
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
