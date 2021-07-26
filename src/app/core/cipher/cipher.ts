import { KeyConfig } from "src/app/models/key-config.model";

export interface Cipher {
    name: string;
    encode(config: KeyConfig, secret: string, keyword?: string): string;
}
