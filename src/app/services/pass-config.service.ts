import { Injectable } from '@angular/core';

import { PassConfig } from '../models/pass-config.model';

@Injectable({
    providedIn: 'root'
})
export class PassConfigService {

    private passConfig: PassConfig;

    constructor() { }

    getPassConfig(): PassConfig {
        return this.passConfig;
    }

    setPassConfig(passConfig: PassConfig): void {
        this.passConfig = passConfig;
    }
}
