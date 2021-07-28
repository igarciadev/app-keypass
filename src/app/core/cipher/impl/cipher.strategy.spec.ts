import { TestBed } from '@angular/core/testing';
import { Cipher } from 'src/app/core/cipher/cipher';
import { CipherStrategy } from 'src/app/core/cipher/impl/cipher.strategy';
import { Strategy } from 'src/app/core/strategy/strategy';
import { UkeleleStrategy } from 'src/app/core/strategy/impl/ukelele-strategy';
import { KeyConfig } from 'src/app/models/key-config.model';

describe('CipherStrategy', () => {
    let config: KeyConfig;
    let cipher: Cipher;
    let secret: string;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        cipher = TestBed.inject(CipherStrategy);

        config = new KeyConfig();
        config.cipher = new CipherStrategy();
        config.strategy = new UkeleleStrategy();
        config.time = 1622745671223;
        config.keyword = 'hostname.com';
        config.salt = '2qozlrz2s258m175i0j402k112owqik1';
        config.iv = 'pi2150kj3763z7l0jt3o00l23uis7ljh';

        secret = 'miPalabraSecreta';
    });

    it('should be created', () => {
        expect(cipher).toBeTruthy();
    });

    it('create cipher', () => {
        const password = cipher.encode(config, secret);

        expect(password).toEqual('ACks5mKertQkymsTdedRyPvmKUbW/uG3hYkIhrD75UU=');
    });
});
