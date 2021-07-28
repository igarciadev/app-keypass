import { TestBed } from '@angular/core/testing';

import { KeyConfig } from 'src/app/models/key-config.model';
import { CipherStrategy } from '../../cipher/impl/cipher.strategy';
import { Strategy } from '../strategy';
import { UkeleleStrategy } from './ukelele-strategy';

function countLetters(service: Strategy, password: string): number {
    return password.replace(/[^A-Za-z]+/g, "").length;
}

function countNumbers(service: Strategy, password: string): number {
    return password.replace(/[^0-9]+/g, '').length;
}

function countSymbols(service: Strategy, password: string): number {
    return password.replace(/[^\W]+/g, '').length;
}

describe('UkeleleStrategy', () => {
    let config: KeyConfig;
    let strategy: Strategy;
    let secret: string;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        strategy = TestBed.inject(UkeleleStrategy);

        config = new KeyConfig();
        config.cipher = new CipherStrategy();
        config.strategy = new UkeleleStrategy();
        config.time = 1622745671223;
        config.keyword = 'hostname.com';
        config.salt = '2qozlrz2s258m175i0j402k112owqik1';
        config.iv = 'pi2150kj3763z7l0jt3o00l23uis7ljh';

        secret = 'miPalabraSecreta';
    });

    afterEach(() => {
        strategy = null;
    });

    it('should be created', () => {
      expect(strategy).toBeTruthy();
    });

    it('create password 1', () => {
        config.upper = true;
        config.lower = true;
        config.number = true;
        config.symbol = true;
        config.length = 20;
        config.minNumbers = 6;
        config.minSymbols = 2;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('KR142T$m^kkth43musU2');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers - config.minSymbols);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 2', () => {
        config.upper = true;
        config.lower = true;
        config.number = true;
        config.symbol = false;
        config.length = 15;
        config.minNumbers = 10;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('T62700t7432usU2');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toEqual(0);
    });

    it('create password 3', () => {
        config.upper = true;
        config.lower = true;
        config.number = true;
        config.symbol = false;
        config.length = 6;
        config.minNumbers = 4;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('32u8U2');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toEqual(0);
    });

    it('create password 4', () => {
        config.upper = true;
        config.lower = true;
        config.number = true;
        config.symbol = false;
        config.length = 48;
        config.minNumbers = 24;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('usU2010Uus0rr8QYywsu3W3Uy2v50R142T62700t7432usU2');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toEqual(0);
    });

    it('create password 5', () => {
        config.upper = true;
        config.lower = true;
        config.number = true;
        config.symbol = false;
        config.length = 36;
        config.minNumbers = 24;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('786Yyw8u3W3Uy2v507142T62700t7432u8U2');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toEqual(0);
    });

    it('create password 6', () => {
        config.upper = true;
        config.lower = true;
        config.number = true;
        config.symbol = false;
        config.length = 64;
        config.minNumbers = 36;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('0R142T62700t7432usU2010Uus0rr8QYywsu3W3Uy2vP0R142T62700t7432usU2');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toEqual(0);
    });

    it('create password 7', () => {
        config.upper = true;
        config.lower = true;
        config.number = true;
        config.symbol = false;
        config.length = 64;
        config.minNumbers = 1;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('KRbecTGmhkktheDmusUC0bkUusKrrIQYywsudWdUymvPKRbecTGmhkktheDmusUC');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toEqual(0);
    });

    it('create password 8', () => {
        config.upper = true;
        config.lower = true;
        config.number = true;
        config.symbol = false;
        config.length = 64;
        config.minNumbers = 62;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('0714296270097432080201000807786Y42803230y21507142962700974320802');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toEqual(0);
    });

    it('create password 9', () => {
        config.upper = true;
        config.lower = true;
        config.number = true;
        config.symbol = true;
        config.length = 6;
        config.minNumbers = 2;
        config.minSymbols = 2;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('3@u^U2');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers - config.minSymbols);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 10', () => {
        config.upper = true;
        config.lower = true;
        config.number = true;
        config.symbol = true;
        config.length = 6;
        config.minNumbers = 1;
        config.minSymbols = 1;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('#musU2');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 11', () => {
        config.upper = true;
        config.lower = true;
        config.number = true;
        config.symbol = true;
        config.length = 14;
        config.minNumbers = 10;
        config.minSymbols = 2;

        config.keyword = '1234';

        const password = strategy.buildPassword(config, '1234');

        expect(password).toEqual('0!4Z^85232628z');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 12', () => {
        config.upper = true;
        config.lower = true;
        config.number = true;
        config.symbol = true;
        config.length = 24;
        config.minNumbers = 12;
        config.minSymbols = 6;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('y@v&0%142T6$700t743%u^U2');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 13', () => {
        config.upper = true;
        config.lower = true;
        config.number = true;
        config.symbol = true;
        config.length = 44;
        config.minNumbers = 26;
        config.minSymbols = 12;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('010$!^07786Yyw&@3W3%y2v50%142&62700^7432#**2');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 14', () => {
        config.upper = true;
        config.lower = true;
        config.number = true;
        config.symbol = true;
        config.length = 64;
        config.minNumbers = 36;
        config.minSymbols = 18;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('0%142&62700*7432!&U2010U@*0^&8*Yyw%#3W3Uy2v$0^142*62700^7432$^U2');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 15', () => {
        config.upper = true;
        config.lower = true;
        config.number = true;
        config.symbol = true;
        config.length = 64;
        config.minNumbers = 1;
        config.minSymbols = 1;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('KR@ecTGmhkktheDmusUC0bkUusKrrIQYywsudWdUymvPKRbecTGmhkktheDmusUC');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 16', () => {
        config.upper = true;
        config.lower = true;
        config.number = true;
        config.symbol = true;
        config.length = 64;
        config.minNumbers = 1;
        config.minSymbols = 61;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('&%@$^&%$%!@*^*^%!&%*0##!@**^&%*Y#&%##*%@y^%$!^$#&*&&&$^^*^&*$^#%');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 17', () => {
        config.upper = false;
        config.lower = true;
        config.number = true;
        config.symbol = true;
        config.length = 6;
        config.minNumbers = 2;
        config.minSymbols = 3;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('3@!^u2');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers - config.minSymbols);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 18', () => {
        config.upper = false;
        config.lower = true;
        config.number = true;
        config.symbol = true;
        config.length = 6;
        config.minNumbers = 1;
        config.minSymbols = 1;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('#musu2');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 19', () => {
        config.upper = false;
        config.lower = true;
        config.number = true;
        config.symbol = true;
        config.length = 6;
        config.minNumbers = 2;
        config.minSymbols = 3;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('3@!^u2');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 20', () => {
        config.upper = false;
        config.lower = true;
        config.number = true;
        config.symbol = true;
        config.length = 24;
        config.minNumbers = 12;
        config.minSymbols = 7;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('y@v&0%142t6$700*743%u^u2');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 21', () => {
        config.upper = false;
        config.lower = true;
        config.number = true;
        config.symbol = true;
        config.length = 44;
        config.minNumbers = 26;
        config.minSymbols = 13;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('010$!^07786yyw&@3w3%y2@50%142&62700^7432#**2');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 22', () => {
        config.upper = false;
        config.lower = true;
        config.number = true;
        config.symbol = true;
        config.length = 64;
        config.minNumbers = 36;
        config.minSymbols = 19;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('0%142&62700*7432!&%2010u@*0^&8*yyw%#3w3uy2v$0^142*62700^7432$^u2');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 23', () => {
        config.upper = false;
        config.lower = true;
        config.number = true;
        config.symbol = true;
        config.length = 64;
        config.minNumbers = 1;
        config.minSymbols = 1;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('kr@ectgmhkkthedmusuc0bkuuskrriqyywsudwduymvpkrbectgmhkkthedmusuc');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 24', () => {
        config.upper = false;
        config.lower = true;
        config.number = true;
        config.symbol = true;
        config.length = 64;
        config.minNumbers = 1;
        config.minSymbols = 62;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('&%@$^&%$%!@*^*^%!&%*0##!@**^&%*y#&%##*%@^^%$!^$#&*&&&$^^*^&*$^#%');
        expect(countLetters(strategy, password)).toBeLessThanOrEqual(config.length - config.minNumbers);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 25', () => {
        config.upper = false;
        config.lower = false;
        config.number = true;
        config.symbol = true;
        config.length = 6;
        config.minNumbers = 2;
        config.minSymbols = 3;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('32!%@2');
        expect(countLetters(strategy, password)).toEqual(0);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 26', () => {
        config.upper = false;
        config.lower = false;
        config.number = true;
        config.symbol = true;
        config.length = 6;
        config.minNumbers = 1;
        config.minSymbols = 1;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('32!%@2');
        expect(countLetters(strategy, password)).toEqual(0);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 27', () => {
        config.upper = false;
        config.lower = false;
        config.number = true;
        config.symbol = true;
        config.length = 6;
        config.minNumbers = 2;
        config.minSymbols = 3;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('32!%@2');
        expect(countLetters(strategy, password)).toEqual(0);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 28', () => {
        config.upper = false;
        config.lower = false;
        config.number = true;
        config.symbol = true;
        config.length = 24;
        config.minNumbers = 12;
        config.minSymbols = 7;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('*2$$0^142&62700^7432!&@2');
        expect(countLetters(strategy, password)).toEqual(0);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 29', () => {
        config.upper = false;
        config.lower = false;
        config.number = true;
        config.symbol = true;
        config.length = 44;
        config.minNumbers = 26;
        config.minSymbols = 13;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('010$!807786#&%8@3^3^*2#507142*62700&7432#%!2');
        expect(countLetters(strategy, password)).toEqual(0);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 30', () => {
        config.upper = false;
        config.lower = false;
        config.number = true;
        config.symbol = true;
        config.length = 64;
        config.minNumbers = 36;
        config.minSymbols = 19;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('07142^62700&7432!^%2010*@&07786^*^*#3&3!#2$50%142&62700*7432$%@2');
        expect(countLetters(strategy, password)).toEqual(0);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 31', () => {
        config.upper = false;
        config.lower = false;
        config.number = true;
        config.symbol = true;
        config.length = 64;
        config.minNumbers = 1;
        config.minSymbols = 1;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('0*142^62700&743@!^%2010*@&0^&8$^*^*#3&3!#$$*0%142&6%700*743^$%@2');
        expect(countLetters(strategy, password)).toEqual(0);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 32', () => {
        config.upper = false;
        config.lower = false;
        config.number = true;
        config.symbol = true;
        config.length = 64;
        config.minNumbers = 2;
        config.minSymbols = 62;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('&%1$%&%$%!@*^*^%!&%&0@#!@**^&%*&#&%##*%@^^%$!^##^*&&&$^^*^&*$^#*');
        expect(countLetters(strategy, password)).toEqual(0);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 26', () => {
        config.upper = false;
        config.lower = false;
        config.number = false;
        config.symbol = true;
        config.length = 6;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('%$!*#@');
        expect(countLetters(strategy, password)).toEqual(0);
        expect(countNumbers(strategy, password)).toEqual(0);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 27', () => {
        config.upper = false;
        config.lower = false;
        config.number = false;
        config.symbol = true;
        config.length = 24;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('#*$*#&@^$*$@^!@&&*&$!%@%');
        expect(countLetters(strategy, password)).toEqual(0);
        expect(countNumbers(strategy, password)).toEqual(0);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 28', () => {
        config.upper = false;
        config.lower = false;
        config.number = false;
        config.symbol = true;
        config.length = 44;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('!#!$!*$%^&*&*$%@*%#%^@@&*&$&^^^$%@#*^*%%#^&&');
        expect(countLetters(strategy, password)).toEqual(0);
        expect(countNumbers(strategy, password)).toEqual(0);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 29', () => {
        config.upper = false;
        config.lower = false;
        config.number = false;
        config.symbol = true;
        config.length = 64;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('&%#$&&%$%!@*^#&%!&%^!$#!@**^&%*&#&%#%*^@^^%$!^%^***&&$^^*&**$^#@');
        expect(countLetters(strategy, password)).toEqual(0);
        expect(countNumbers(strategy, password)).toEqual(0);
        expect(countSymbols(strategy, password)).toBeGreaterThanOrEqual(config.minSymbols);
    });

    it('create password 30', () => {
        config.upper = false;
        config.lower = false;
        config.number = true;
        config.symbol = false;
        config.length = 6;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('320802');
        expect(countLetters(strategy, password)).toEqual(0);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toEqual(0);
    });

    it('create password 31', () => {
        config.upper = false;
        config.lower = false;
        config.number = true;
        config.symbol = false;
        config.length = 24;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('421507142962700974320802');
        expect(countLetters(strategy, password)).toEqual(0);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toEqual(0);
    });

    it('create password 32', () => {
        config.upper = false;
        config.lower = false;
        config.number = true;
        config.symbol = false;
        config.length = 44;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('01000807786442803230421507142962700974320802');
        expect(countLetters(strategy, password)).toEqual(0);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toEqual(0);
    });

    it('create password 33', () => {
        config.upper = false;
        config.lower = false;
        config.number = true;
        config.symbol = false;
        config.length = 64;

        const password = strategy.buildPassword(config, secret);

        expect(password).toEqual('0714296270097432080201000807786442803230421507142962700974320802');
        expect(countLetters(strategy, password)).toEqual(0);
        expect(countNumbers(strategy, password)).toBeGreaterThanOrEqual(config.minNumbers);
        expect(countSymbols(strategy, password)).toEqual(0);
    });
});
