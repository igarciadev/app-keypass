import { Injectable } from '@angular/core';

import { CipherStrategy } from '../core/cipher/impl/cipher.strategy';
import { UkeleleStrategy } from '../core/strategy/impl/ukelele-strategy';
import { KeyConfig } from '../models/key-config.model';
import { PassConfig } from '../models/pass-config.model';
import { StorageService } from './storage.service';
import sampleData from 'resources/data/sample.json'

@Injectable({
    providedIn: 'root'
})
export class InitializerService {

    sampleData: any[];

    constructor(private storageService: StorageService) {
        this.sampleData = sampleData;
    }

    addSampleData(): void {

        sampleData.forEach(item => {
            let cipherStrategy = new CipherStrategy();
            let ukeleStrategy = new UkeleleStrategy();
            let keyConfig = new KeyConfig();
            let passConfig = new PassConfig();

            cipherStrategy.name = 'CipherStrategy';

            ukeleStrategy.name = 'UkeleleStrategy';

            keyConfig.cipher = cipherStrategy;
            keyConfig.strategy = ukeleStrategy;
            keyConfig.salt = item.keyConfig.salt;
            keyConfig.iv = item.keyConfig.iv;
            keyConfig.time = item.keyConfig.time;
            keyConfig.keyword = item.keyConfig.keyword;
            keyConfig.upper = item.keyConfig.upper;
            keyConfig.lower = item.keyConfig.lower;
            keyConfig.number = item.keyConfig.number;
            keyConfig.symbol = item.keyConfig.symbol;
            keyConfig.length = item.keyConfig.length;
            keyConfig.minLength = item.keyConfig.minLength;
            keyConfig.maxLength = item.keyConfig.maxLength;
            keyConfig.minNumbers = item.keyConfig.minNumbers;
            keyConfig.minSymbols = item.keyConfig.minSymbols;

            passConfig.id = item.id;
            passConfig.name = item.name;
            passConfig.username = item.username;
            passConfig.uri = item.uri;
            passConfig.notes = item.notes;
            passConfig.image = item.image;
            passConfig.favorite = item.favorite;
            passConfig.createdOn = item.createdOn;
            passConfig.updatedOn = item.updatedOn;
            passConfig.keyConfig = keyConfig;

            this.storageService.addPassConfig(passConfig);
        })
    }
}
