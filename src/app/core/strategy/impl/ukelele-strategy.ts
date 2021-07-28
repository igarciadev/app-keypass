import { Injectable } from '@angular/core';
import { Strategy } from 'src/app/core/strategy/strategy';
import { KeyConfig } from 'src/app/models/key-config.model';

@Injectable({
    providedIn: 'root'
})
export class UkeleleStrategy implements Strategy {

    name: string;
    symbols: string;
    numbers: string;
    letters: string;
    excludedSymbols: string;

    constructor() {
        this.name = UkeleleStrategy.name;
        this.symbols = '!@#$%^&*';
        this.numbers = '0123456789';
        this.letters = 'abcdefghijklmnopqrstuvwxyz';
        this.excludedSymbols = '+=/';
    }

    public buildPassword(keyConfig: KeyConfig, secret: string): string {

        if (!keyConfig.upper && !keyConfig.lower && (!keyConfig.number || !keyConfig.symbol)) {
            keyConfig.minNumbers = keyConfig.length;
            keyConfig.minSymbols = keyConfig.length;
        }

        if (!keyConfig.lower && !keyConfig.upper) {
            let result = keyConfig.length - keyConfig.minNumbers - keyConfig.minSymbols;
            if (result > 0) {
                keyConfig.minNumbers += result / 2;
                keyConfig.minSymbols += result / 2;
                if (result % 2 !== 0) {
                    keyConfig.minNumbers += 0.5;
                    keyConfig.minSymbols -= 0.5;
                }
            }
        }

        let password = keyConfig.cipher.encode(keyConfig, secret);

        password = this.cut(keyConfig, password, secret);
        password = this.sanitize(password);

        if (keyConfig.lower || keyConfig.upper || keyConfig.number || keyConfig.symbol) {

            if (keyConfig.number) {
                password = this.addNumbers(keyConfig, password);
            }

            if (keyConfig.symbol) {
                password = this.addSymbols(keyConfig, password);
            }

            if (keyConfig.lower && !keyConfig.upper) {
                password = password.toLowerCase();
            } else if (!keyConfig.lower && keyConfig.upper) {
                password = password.toUpperCase();
            }
        }

        return password;
    }

    private cut(keyConfig: KeyConfig, password: string, secret: string): string {

        if (password.length >= keyConfig.length) {
            const newPassword = this.reorder(this.reorder(password, 2), 1);
            return newPassword.substring(newPassword.length - keyConfig.length);
        } else {
            return this.cut(keyConfig, keyConfig.cipher.encode(keyConfig, secret, keyConfig.keyword) + password, secret);
        }
    }

    private reorder(password: string, module: number): string {

        let newPassword = '';
        for (let i = 0; i < password.length; i++) {

            if (i % module === 0) {
                newPassword += password[i];
            } else {
                newPassword += password[password.length - i];
            }
        }

        return newPassword;
    }

    public sanitize(password: string): string {

        for (let i = 0; i <= this.numbers.length; i++) {

            if (i < this.excludedSymbols.length) {
                let symbol = this.excludedSymbols[i];
                password = password.replace(new RegExp('\\' + symbol, 'g'), this.letters[i]);
            }

            password = password.replace(new RegExp(String(i), 'g'), this.letters[this.letters.length - 1 - i]);
        }

        return password;
    }

    public addNumbers(keyConfig: KeyConfig, password: string): string {

        for (let i = 0; i < keyConfig.minNumbers; i++) {

            let count = 0;
            let position = -1;
            while (position < 0) {
                position = password.indexOf(this.letters[count]);
                if (position < 0) {
                    position = password.indexOf(this.letters[count].toUpperCase());
                }

                count++;
            }

            count = (count - 1) % 10;

            password = password.replace(password[position], String(count));
        }

        let checkPass = password;
        for (let i = 0; i < this.numbers.length; i++) {
            checkPass = checkPass.replace(new RegExp(String(i), 'g'), '');
        }

        let upperCheck = false;
        let lowerCheck = false;
        checkPass.split('').forEach(m => {
            if (this.letters.toUpperCase().indexOf(m) >= 0 && !upperCheck) {
                upperCheck = true;
            }
            if (this.letters.indexOf(m) >= 0 && !lowerCheck) {
                lowerCheck = true;
            }
        });

        if (!upperCheck && keyConfig.upper) {
            password = password.replace(checkPass[0], checkPass[0].toUpperCase());
        }

        if (!lowerCheck && keyConfig.lower) {
            password = password.replace(checkPass[0], checkPass[0].toLowerCase());
        }

        return password;
    }

    public addSymbols(keyConfig: KeyConfig, password: string): string {

        let symbolsCopy: string[] = [];

        for (let i = 0; i < keyConfig.minSymbols; i++) {

            let count = 0;
            let position = -1;
            while (position < 0) {
                position = password.indexOf(this.letters[count]);
                if (position < 0) {
                    position = password.indexOf(this.letters[count].toUpperCase());
                }
                count++;
            }

            count = (count - 1) % 10;

            if (count > symbolsCopy.length - 1) {
                count = Math.round(count / 2);
            }

            if (symbolsCopy.length - 1 < count) {
                symbolsCopy = this.symbols.split('');
            }

            const letter = password[position];
            const symbol = symbolsCopy[count];

            symbolsCopy.splice(count, 1);

            password = password.replace(letter, symbol);
        }

        return password;
    }
}
