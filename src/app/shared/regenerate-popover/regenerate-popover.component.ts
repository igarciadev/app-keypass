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

    type: string;
    eyeIconName: string;
    showPassword: boolean;
    showKeyboard: boolean;
    text: any;

    constructor(
        private keyboard: Keyboard,
        private platform: Platform,
        private popoverController: PopoverController
    ) { }

    ngOnInit() {
        this.type = 'password';
        this.eyeIconName = 'eye-off-outline';
        this.showPassword = false;
        this.showKeyboard = false;
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
        this.type = this.showPassword ? 'text' : 'password';
        this.eyeIconName = this.showPassword ? 'eye-outline' : 'eye-off-outline';

    }

    regeneratePassword(secret: string | number) {
        this.popoverController.dismiss({
            item: { secret: secret }
        });
    }
}
