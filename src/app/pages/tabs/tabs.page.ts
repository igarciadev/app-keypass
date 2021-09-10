import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StorageService } from 'src/app/services/storage.service';
import { UrlService } from 'src/app/services/url.service';
import text from 'src/assets/text/tabs.text.json';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html'
})
export class TabsPage implements OnInit {

    currentUrl: string;
    text: any;

    constructor(
        private router: Router,
        private storageService: StorageService,
        private urlService: UrlService
    ) { }

    ngOnInit() {
        this.currentUrl = null;
        this.text = text;
    }

    ionViewWillEnter() {
        this.urlService.currentUrl$
            .subscribe((currentUrl: string) => {
                this.currentUrl = currentUrl;
            });
    }

    navigateToListTab() {
        this.router.navigateByUrl('tabs/safe-tab', { replaceUrl: true });
    }

    navigateToPasswordTab() {
        this.router.navigateByUrl('tabs/password-tab', { replaceUrl: true });
    }

    navigateToGroupTab() {
        this.router.navigateByUrl('tabs/group-tab', { replaceUrl: true });
    }

    get show(): boolean {
        return this.currentUrl !== null &&
            (this.currentUrl === '/' ||
                (this.currentUrl.includes('/tabs/safe-tab') &&
                    this.currentUrl !== '/tabs/safe-tab/view' &&
                    this.currentUrl !== '/tabs/safe-tab/edit') ||
                this.currentUrl === '/tabs/password-tab' ||
                this.currentUrl === '/tabs/group-tab');
    }
}
