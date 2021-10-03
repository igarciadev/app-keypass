import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ActionPopoverComponent } from './shared/action-popover/action-popover.component';
import { ListPopoverComponent } from './shared/list-popover/list-popover.component';
import { RegeneratePopoverComponent } from './shared/regenerate-popover/regenerate-popover.component';
import { PasswordTabPageModule } from './pages/password-tab/password-tab.module';

@NgModule({
    declarations: [
        AppComponent,
        ActionPopoverComponent,
        ListPopoverComponent,
        RegeneratePopoverComponent
    ],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        PasswordTabPageModule
    ],
    providers: [
        {
            provide: RouteReuseStrategy,
            useClass: IonicRouteStrategy
        },
        File,
        FileChooser,
        FilePath,
        LocalNotifications

    ],
    bootstrap: [
        AppComponent
    ],
})
export class AppModule { }
