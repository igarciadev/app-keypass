import { PassConfig } from 'src/app/models/pass-config.model';

export class PassConfigLists {
    sort: boolean;
    favorites: number;
    passConfigs: PassConfig[];
    passConfigFavorites: PassConfig[];
    passConfigStored: PassConfig[];
    passConfigSearch: PassConfig[];
}
