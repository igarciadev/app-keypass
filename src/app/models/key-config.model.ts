import { BaseConfig } from 'src/app/models/base-config.model';
import { Cipher } from 'src/app/core/cipher/cipher';
import { CipherSelector } from 'src/app/core/cipher/cipher-selector';
import { Strategy } from 'src/app/core/strategy/strategy';
import { StrategySelector } from 'src/app/core/strategy/strategy-selector';

export class KeyConfig extends BaseConfig {
    public cipher: Cipher;
    public strategy: Strategy;
    public salt: string;
    public iv: string;
    public time: number;
    public keyword: string;
    public upper: boolean;
    public lower: boolean;
    public number: boolean;
    public symbol: boolean;
    public length: number;
    public minLength: number;
    public maxLength: number;
    public minNumbers: number;
    public minSymbols: number;

    constructor(init?: Partial<KeyConfig>) {
        super();
        this.salt = this.notEmpty(init, 'salt') ? init.salt : '';
        this.iv = this.notEmpty(init, 'iv') ? init.iv : '';
        this.time = this.notEmpty(init, 'time') ? init.time : new Date().getTime();
        this.keyword = this.notEmpty(init, 'keyword') ? init.keyword : '';
        this.upper = this.notEmpty(init, 'upper') ? init.upper : true;
        this.lower = this.notEmpty(init, 'lower') ? init.lower : true;
        this.number = this.notEmpty(init, 'number') ? init.number : true;
        this.symbol = this.notEmpty(init, 'symbol') ? init.symbol : false;
        this.length = this.notEmpty(init, 'length') ? init.length : 10;
        this.minLength = this.notEmpty(init, 'minLength') ? init.minLength : 4;
        this.maxLength = this.notEmpty(init, 'maxLength') ? init.maxLength : 64;
        this.minNumbers = this.notEmpty(init, 'minNumbers') ? init.minNumbers : 1;
        this.minSymbols = this.notEmpty(init, 'minSymbols') ? init.minSymbols : 1;
        this.cipher = this.notEmpty(init, 'cipher') ? new CipherSelector(init.cipher).getCipher() : new CipherSelector().getCipher();
        this.strategy = this.notEmpty(init, 'strategy') ? new StrategySelector(init.strategy).getStrategy() : new StrategySelector().getStrategy();
    }

    update(keyConfig: KeyConfig): void {
        this.time = new Date().getTime();
        this.keyword = keyConfig.keyword;
        this.upper = keyConfig.upper;
        this.lower = keyConfig.lower;
        this.number = keyConfig.number;
        this.symbol = keyConfig.symbol;
        this.length = keyConfig.length;
        this.minLength = keyConfig.minLength;
        this.maxLength = keyConfig.maxLength;
        this.minNumbers = keyConfig.minNumbers;
        this.minSymbols = keyConfig.minSymbols;
    }

    equals(keyConfig: KeyConfig): boolean {
        return this.keyword === keyConfig.keyword &&
            this.length === keyConfig.length &&
            this.lower === keyConfig.lower &&
            this.maxLength === keyConfig.maxLength &&
            this.minLength === keyConfig.minLength &&
            this.minNumbers === keyConfig.minNumbers &&
            this.minSymbols === keyConfig.minSymbols &&
            this.number === keyConfig.number &&
            this.symbol === keyConfig.symbol &&
            this.time === keyConfig.time &&
            this.upper === keyConfig.upper;
    }
}
