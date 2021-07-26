import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';

import { EditPassConfigPage } from './edit-pass-config.page';
import { EditPassConfigPageRoutingModule } from './edit-pass-config-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        EditPassConfigPageRoutingModule
    ],
    declarations: [
        EditPassConfigPage
    ],
    providers: [
        Clipboard,
        Keyboard
    ]
})
export class EditPassConfigPageModule { }
