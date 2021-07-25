import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';

import { ListTabPage } from './list-tab.page';
import { ListTabPageRoutingModule } from './list-tab-routing.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ListTabPageRoutingModule
    ],
    declarations: [ListTabPage]
})
export class ListTabPageModule { }
