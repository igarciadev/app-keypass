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

    searchTerm: string;
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

    search(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.passConfigSearchService.search(searchTerm);
    }

    async mainActionSheet(passConfig: PassConfig): Promise<void> {
        let result = await this.actionSheetService.mainActionSheet(passConfig);
        if (result === 'deleteItem') {
            this.search(this.searchTerm);
        }
    }

    firstLetter(name: string): string {
        return name.substr(0, 1);
    }

    firstLetterClass(name: string): string {
        return `square square-${name.substr(0, 1).toLowerCase()}`;
    }

    hasImage(passConfig: PassConfig): boolean {
        return passConfig.image !== undefined && passConfig.image !== null && !passConfig.image.includes('domain_url=null');
    }

    getValues(): PassConfig[] {
        return this.passConfigSearchService.list
    }
}
