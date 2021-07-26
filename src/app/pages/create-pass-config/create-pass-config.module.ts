import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';

import { CreatePassConfigPage } from './create-pass-config.page';
import { CreatePassConfigPageRoutingModule } from './create-pass-config-routing.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        CreatePassConfigPageRoutingModule
    ],
    declarations: [
        CreatePassConfigPage
    ],
    providers: [
        Keyboard
    ]
})
export class CreatePassConfigPageModule { }
