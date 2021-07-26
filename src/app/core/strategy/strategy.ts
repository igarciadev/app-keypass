import { KeyConfig } from 'src/app/models/key-config.model';

export interface Strategy {
    name: string;
    buildPassword(config: KeyConfig, secret: string): string;
    sanitize(password: string): string;
    addNumbers(config: KeyConfig, password: string): string;
    addSymbols(config: KeyConfig, password: string): string;
}
