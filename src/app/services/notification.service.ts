import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

import { PassConfig } from '../models/pass-config.model';

import text from 'src/assets/text/notification.service.text.json';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    text: any;

    constructor(
        public localNotifications?: LocalNotifications
    ) {
        this.text = text;
    }

    createLocalNotification(passConfig: PassConfig): void {
        this.localNotifications.clearAll();
        if (passConfig.security && passConfig.keyConfig.timeCore.date > new Date()) {
            this.localNotifications.schedule([{
                id: 0,
                title: this.text.expiredText,
                text: this.text.changeText,
                trigger: { at: passConfig.keyConfig.timeCore.date }
            }]);
        } else if (!passConfig.security) {
            this.localNotifications.cancel(passConfig.id);
        }
    }
}
