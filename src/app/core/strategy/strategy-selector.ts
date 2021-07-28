import { KeyConfig } from "src/app/models/key-config.model";
import { UkeleleStrategy } from "./impl/ukelele-strategy";
import { Strategy } from "./strategy";


export class StrategySelector {
    private strategy: Strategy;

    constructor(strategy?: Strategy) {
        this.strategy = new UkeleleStrategy();
    }

    public init(keyConfig: KeyConfig, secret: string): string {
        return this.strategy.buildPassword(keyConfig, secret);
    }

    getStrategy(): Strategy {
        return this.strategy;
    }
}
