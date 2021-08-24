import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AlertController, NavController, PopoverController } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';

import { TimeCore } from 'src/app/core/time.core';
import { PassConfig } from 'src/app/models/pass-config.model';
import { ActionSheetService } from 'src/app/services/action-sheet.service';
import { FileService } from 'src/app/services/file.service';
import { PassConfigFavoriteService } from 'src/app/services/pass-config-favorite.service';
import { PassConfigListService } from 'src/app/services/pass-config-list.service';
import { ListPopoverComponent } from 'src/app/shared/list-popover/list-popover/list-popover.component';
import { environment } from 'src/environments/environment';
import text from 'src/assets/text/list-tab.text.json';

@Component({
    selector: 'app-list-tab',
    templateUrl: 'list-tab.page.html',
    styleUrls: ['list-tab.page.scss']
})
export class ListTabPage {

    passConfigList: PassConfig[];
    listLength: number;
    passConfigFavoriteList: PassConfig[];
    favoriteLength: number;
    toggleSort: boolean;
    toggleFavorite: boolean;
    text: any;

    constructor(
        private actionSheetService: ActionSheetService,
        private alertController: AlertController,
        public filePath: FilePath,
        private fileService: FileService,
        private navController: NavController,
        public passConfigListService: PassConfigListService,
        public passConfigFavoriteService: PassConfigFavoriteService,
        private popoverController: PopoverController,
        private router: Router,
        private titleService: Title
    ) {
        this.toggleSort = true;
        this.toggleFavorite = true;
        this.text = text;
    }

    ionViewWillEnter() {
        this.titleService.setTitle('List Page');
        this.passConfigListService.init(this.toggleSort);
        this.passConfigFavoriteService.init();
        this.loadLists();
    }

    loadLists() {
        this.passConfigListService.init(this.toggleSort);
        this.passConfigFavoriteService.init();
        this.passConfigList = this.passConfigListService.list;
        this.listLength = this.passConfigList.length;
        this.passConfigFavoriteList = this.passConfigFavoriteService.list;
        this.favoriteLength = this.passConfigFavoriteList.length;
    }

    navigateToListTab(): void {
        this.navController.back();
    }

    navigateToCreateView(): void {
        this.router.navigateByUrl('/tabs/safe-tab/create');
    }
    }

    favoriteToggler(): void {
        this.toggleFavorite = !this.toggleFavorite;
    }

    sortToggler(ascending: boolean): void {
        this.toggleSort = ascending;
        this.passConfigListService.sort(this.toggleSort);
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
        return name.substr(0, 1);
    }

    firstLetterClass(name: string): string {
        return `circle-${name.substr(0, 1).toLowerCase()}`;
    }

    hasImage(passConfig: PassConfig): boolean {
        passConfig.image = passConfig.buildImage(passConfig.uri);
        return passConfig.image !== undefined && passConfig.image !== null && !passConfig.image.includes('domain_url=null');
    }

    get showFavoriteList(): boolean {
        return this.passConfigFavoriteService.listLength() > 0;
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
            componentProps: { ascending: this.toggleSort }
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
}
