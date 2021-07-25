import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPage } from './search.page';
import { SearchPageRoutingModule } from './search-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SearchPageRoutingModule
    ],
    declarations: [
        SearchPage
    ]
})
export class SearchPageModule { }
