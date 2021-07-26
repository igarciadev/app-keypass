import { Component, OnInit } from '@angular/core';

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
        public passConfigSearchService: PassConfigSearchService
    ) {
        passConfigSearchService.init();
    }

    ngOnInit() {
        this.text = text;
    }

    search(searchTerm): void {
        this.passConfigSearchService.search(searchTerm);
    }

    mainActionSheet(passConfig: PassConfig): Promise<void> {
        return this.actionSheetService.mainActionSheet(passConfig);
    }
}