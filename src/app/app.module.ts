import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ActionPopoverComponent } from './shared/action-popover/action-popover.component';
import { RegeneratePopoverComponent } from './shared/regenerate-popover/regenerate-popover.component';
import { PasswordTabPageModule } from './pages/password-tab/password-tab.module';

@NgModule({
    declarations: [
        AppComponent,
        ActionPopoverComponent,
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
        }

    ],
    bootstrap: [
        AppComponent
    ],
})
export class AppModule { }
