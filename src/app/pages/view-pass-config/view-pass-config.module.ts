import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { ViewPassConfigPage } from './view-pass-config.page';
import { ViewPassConfigPageRoutingModule } from './view-pass-config-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        ViewPassConfigPageRoutingModule
    ],
    declarations: [
        ViewPassConfigPage
    ],
    providers: [
        Clipboard,
        Keyboard,
        InAppBrowser
    ]
})
export class ViewPassConfigPageModule { }
