import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';

import { GroupTabPageRoutingModule } from './group-tab-routing.module';

import { GroupTabPage } from './group-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupTabPageRoutingModule
  ],
  declarations: [
      GroupTabPage
    ],
  providers: [
      Clipboard,
      Keyboard
  ]
})
export class GroupTabPageModule {}
