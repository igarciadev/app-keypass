import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Cipher } from 'src/app/core/cipher/cipher';
import { KeyConfig } from 'src/app/models/key-config.model';

@Injectable({
    providedIn: 'root'
})
export class CipherStrategy implements Cipher {

    name: string = CipherStrategy.name;

    constructor() { }

    public encode(config: KeyConfig, secret: string, keyword?: string): string {

        if (keyword === undefined) {
            keyword = config.keyword;
        }

        keyword = keyword + config.time;

        const salt = CryptoJS.enc.Hex.parse(config.salt);
        const iv = CryptoJS.enc.Hex.parse(config.iv);
        const key = CryptoJS.PBKDF2(secret, salt, { keySize: 128 / 32, iterations: 100 });
        const opt = { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 };

        return CryptoJS.AES.encrypt(keyword, key, opt).toString();
    }
}
