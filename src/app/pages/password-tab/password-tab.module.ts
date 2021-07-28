import { IonicModule } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PasswordTabPage } from './password-tab.page';
import { PasswordTabPageRoutingModule } from './password-tab-routing.module';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { CounterComponent } from 'src/app/shared/components/counter/counter.component';
import { InputComponent } from 'src/app/shared/components/input/input.component';
import { PasswordComponent } from 'src/app/shared/components/password/password.component';
import { TextareaComponent } from 'src/app/shared/components/textarea/textarea.component';
import { ToggleComponent } from 'src/app/shared/components/toggle/toggle.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        PasswordTabPageRoutingModule,
        ReactiveFormsModule
    ],
    declarations: [
        PasswordTabPage,
        ButtonComponent,
        CounterComponent,
        InputComponent,
        PasswordComponent,
        TextareaComponent,
        ToggleComponent
    ],
    providers: [
        Clipboard
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PasswordTabPageModule { }
