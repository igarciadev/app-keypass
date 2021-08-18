import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { PassConfig } from 'src/app/models/pass-config.model';
import { ActionSheetService } from 'src/app/services/action-sheet.service';
import { PassConfigSearchService } from 'src/app/services/pass-config-search.service';
import text from 'src/assets/text/search.text.json';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

    text: any;

    constructor(
        private actionSheetService: ActionSheetService,
        public passConfigSearchService: PassConfigSearchService,
        private titleService: Title
    ) {
        passConfigSearchService.init();
    }

    ngOnInit() {
        this.text = text;
    }

    ionViewWillEnter() {
        this.titleService.setTitle('Search Page');
    }

    search(searchTerm): void {
        this.passConfigSearchService.search(searchTerm);
    }

    mainActionSheet(passConfig: PassConfig): void {
        this.actionSheetService.mainActionSheet(passConfig);
    }

    firstLetter(name: string): string {
        return name.substr(0, 1);
    }

    firstLetterClass(name: string): string {
        return `circle-${name.substr(0, 1).toLowerCase()}`;
    }

    hasImage(passConfig: PassConfig): boolean {
        return passConfig.image !== undefined && passConfig.image !== null && !passConfig.image.includes('domain_url=null');
    }
}
