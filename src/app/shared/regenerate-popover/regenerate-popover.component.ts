import { Component, OnInit } from '@angular/core';

import { Platform, PopoverController } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';

import text from 'src/assets/text/regenerate-popover.text.json';

@Component({
    selector: 'app-regenerate-popover',
    templateUrl: './regenerate-popover.component.html',
    styleUrls: ['./regenerate-popover.component.scss'],
})
export class RegeneratePopoverComponent implements OnInit {

    passwordType: string;
    eyeIconName: string;
    showPassword: boolean;
    showKeyboard: boolean;
    passwordClass: string;
    text: any;

    constructor(
        private keyboard: Keyboard,
        private platform: Platform,
        private popoverController: PopoverController
    ) { }

    ngOnInit() {
        this.passwordType = 'password';
        this.eyeIconName = 'eye-off-outline';
        this.showPassword = false;
        this.showKeyboard = false;
        this.passwordClass = 'field-input';
        this.text = text;

        this.platform.ready().then(() => {
            let element = document.getElementsByClassName('popover-content sc-ion-popover-md')[0];
            this.keyboard.onKeyboardShow().subscribe(() => {
                element['style'].top = '10%';
                element['style'].transition = 'top 0.25s';
            });

            this.keyboard.onKeyboardHide().subscribe(() => {
                element['style'].top = '30%';
                element['style'].transition = 'top 0.25s';
            });
        });
    }

    async dismissClick() {
        await this.popoverController.dismiss();
    }

    toggleEyeIcon() {
        this.showPassword = !this.showPassword;
        this.passwordType = this.showPassword ? 'text' : 'password';
        this.eyeIconName = this.showPassword ? 'eye-outline' : 'eye-off-outline';
        this.passwordClass = !this.showPassword ? 'field-input' : '';
    }

    regeneratePassword(secret: string | number) {
        this.popoverController.dismiss({
            item: { secret: secret }
        });
    }
}
