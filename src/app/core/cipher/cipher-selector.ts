import { Cipher } from 'src/app/core/cipher/cipher';
import { CipherStrategy } from "./impl/cipher.strategy";

export class CipherSelector {

    private cipher: Cipher;

    constructor(cipher?: Cipher) {
        this.cipher = new CipherStrategy();
    }

    getCipher(): Cipher {
        return this.cipher;
    }
}
