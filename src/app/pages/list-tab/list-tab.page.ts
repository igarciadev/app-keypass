import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AlertController, NavController, PopoverController } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';

import { TimeCore } from 'src/app/core/time.core';
import { PassConfig } from 'src/app/models/pass-config.model';

import { ActionSheetService } from 'src/app/services/action-sheet.service';
import { FileService } from 'src/app/services/file.service';
import { SortListService } from 'src/app/services/sort-list.service';
import { StorageService } from 'src/app/services/storage.service';
import { ListPopoverComponent } from 'src/app/shared/list-popover/list-popover.component';

import { environment } from 'src/environments/environment';

import text from 'src/assets/text/list-tab.text.json';

@Component({
    selector: 'app-list-tab',
    templateUrl: 'list-tab.page.html',
    styleUrls: ['list-tab.page.scss']
})
export class ListTabPage implements OnInit {

    groupKeys: string[];
    groupValues: Map<string, PassConfig[]>;
    showGroups: boolean[];
    toggleSort: boolean;
    navigateToSearch: string;
    navigateToCreate: string;
    text: any;

    constructor(
        private actionSheetService: ActionSheetService,
        private activatedRoute: ActivatedRoute,
        private alertController: AlertController,
        public filePath: FilePath,
        private fileService: FileService,
        private navController: NavController,
        private popoverController: PopoverController,
        private router: Router,
        private sortListService: SortListService,
        private storageService: StorageService,
        private titleService: Title
    ) {
        this.groupKeys = [];
        this.groupValues = new Map<string, PassConfig[]>();
        this.showGroups = [];
    }

    ngOnInit() {
        this.toggleSort = true;
        this.navigateToSearch = '/tabs/safe-tab/search';
        this.navigateToCreate = '/tabs/safe-tab/create';
        this.text = text;
    }

    ionViewWillEnter() {
        this.titleService.setTitle('List Page');
        this.loadLists();
    }

    loadLists() {
        this.groupKeys = [];
        this.groupValues = new Map<string, PassConfig[]>();
        this.showGroups = [];

        this.groupKeys.push('Favoritos');

        const groups = this.storageService.getGroups();
        groups.forEach(group => {
            this.groupKeys.push(group.name);
            this.showGroups.push(true);
            this.showGroups.push(true);
            let passConfigs = this.storageService.findPassConfigByGroupId(group.id);
            if (group.name === 'Sin agrupar') {
                passConfigs = passConfigs.concat(this.storageService.findPassConfigByGroupId(undefined));
            }
            this.sortListService.sort(passConfigs, this.toggleSort);
            this.groupValues.set(group.name, passConfigs);
        });

        let passConfigs = this.storageService.findFavoritePassConfigs();
        this.sortListService.sort(passConfigs, this.toggleSort);
        this.groupValues.set('Favoritos', passConfigs);
    }

    getKeys(): string[] {
        if (this.groupKeys.length > 0) {
            const favoritesPosition = this.groupKeys.findIndex(key => key === 'Favoritos');
            const favoritesKey = this.groupKeys[favoritesPosition];
            this.groupKeys.splice(favoritesPosition, 1)

            const ungroupPosition = this.groupKeys.findIndex(key => key === 'Sin agrupar');
            const ungroupKey = this.groupKeys[ungroupPosition];
            this.groupKeys.splice(ungroupPosition, 1)

            this.groupKeys.sort();

            this.groupKeys.unshift(favoritesKey);
            this.groupKeys.push(ungroupKey);
        }

        return this.groupKeys;
    }

    getValues(key: string): PassConfig[] {
        return Array.from(this.groupValues.get(key)).filter(passConfig => {
            if (key !== 'Favoritos' && passConfig.favorite === false) {
                return passConfig;
            } else if (key === 'Favoritos' && passConfig.favorite !== false) {
                return passConfig;
            }
        });
    }

    navigateToListTab(): void {
        this.navController.back();
    }

    navigateTo(url: string): void {
        this.router.navigateByUrl(url);
    }

    groupToggler(position: number): void {
        this.showGroups[position] = !this.showGroups[position];
    }

    sortToggler(ascending: boolean): void {
        this.toggleSort = ascending;
        this.loadLists();
    }

    createBackup(): void {
        const fileName = `${environment.fileName}-${new TimeCore().forFile()}`;
        this.fileService.exportToJsonFile(fileName);
    }

    restoreBackup(): void {
        this.fileService.pickFile()
            .then(selectedPath => {
                return this.filePath.resolveNativePath(selectedPath)
                    .then(resolvedNativePath => {
                        this.fileService.importFormJsonFile(resolvedNativePath)
                            .then(() => {
                                this.loadLists();
                            })
                    });
            });
    }

    firstLetter(name: string): string {
        return name.substr(0, 1).toUpperCase();
    }

    firstLetterClass(name: string): string {
        return `circle-${name.substr(0, 1).toLowerCase()}`;
    }

    getUrlParameter(parameterName: string): string {
        return this.activatedRoute.snapshot.paramMap.get(parameterName);
    }

    async callMainActionSheet(passConfig: PassConfig): Promise<void> {
        let result = await this.actionSheetService.mainActionSheet(passConfig);
        if (result === 'deleteItem' || result === 'favoriteItem') {
            this.loadLists();
        }
    }

    async listPopover(event: any) {
        const popover = await this.popoverController.create({
            component: ListPopoverComponent,
            event: event,
            translucent: true,
            componentProps: { ascending: this.toggleSort, page: 'list-tab' }
        });

        await popover.present();

        const { data } = await popover.onDidDismiss();

        switch (data !== undefined && data.item.action) {
            case 'ascending':
                this.sortToggler(true);
                break;
            case 'descending':
                this.sortToggler(false);
                break;
            case 'export':
                this.createBackupAlert();
                break;
            case 'import':
                this.restoreBackupAlert();
                break;
            default:
                break;
        }
    }

    async createBackupAlert() {
        const alert = await this.alertController.create({
            header: this.text.backupText,
            message: this.text.createBackupTex,
            buttons: [
                {
                    text: this.text.cancelText,
                    role: 'cancel'
                }, {
                    text: this.text.acceptText,
                    handler: () => {
                        this.createBackup();
                    }
                }
            ]
        });

        await alert.present();
    }

    async restoreBackupAlert() {
        const alert = await this.alertController.create({
            header: this.text.backupText,
            message: `${this.text.restoreBackupTex}<br><br><br><strong>${this.text.warningText}</strong><br><br>${this.text.overwrittenText}<br><br>${this.text.notUndoneText}`,
            buttons: [
                {
                    text: this.text.cancelText,
                    role: 'cancel'
                }, {
                    text: this.text.acceptText,
                    handler: () => {
                        this.restoreBackup();
                    }
                }
            ]
        });

        await alert.present();
    }

    hasImage(passConfig: PassConfig): boolean {
        passConfig.image = passConfig.buildImage(passConfig.uri);
        return passConfig.image !== undefined && passConfig.image !== null && !passConfig.image.includes('domain_url=null');
    }

    showGroup(groupName: string): boolean {
        return this.getValues(groupName).length > 0;
    }

    hasFavorites(groupName: string): boolean {
        return groupName === 'Favoritos';
    }

    showList(groupName: string, position: number): boolean {
        return !this.hasFavorites(groupName) && this.showGroups[position];
    }

    validDateWarning(passConfig: PassConfig): string {
        let color: string = '';
        if (passConfig.keyConfig.updatedOn) {
            const dateString = passConfig.keyConfig.updatedOn.replace(/:/g, '/').replace(' ', '/').split("/");
            const passConfigDate: Date = new Date(
                Number(dateString[2]), Number(dateString[1]) - 1, Number(dateString[0]),
                Number(dateString[3]), Number(dateString[4]), Number(dateString[5])
            );

            if (passConfigDate !== undefined) {
                const nowDate: Date = new Date();
                const daysBetweenDates: number = (passConfigDate.getTime() - nowDate.getTime()) / (1000 * 3600 * 24);

                if (passConfig.security && daysBetweenDates <= 14 && daysBetweenDates > 0) {
                    color = 'warning';
                } else if (passConfig.security && daysBetweenDates <= 0) {
                    color = 'danger';
                }
            }
        }

        return color;
    }
}
