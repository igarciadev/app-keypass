import { Component, OnInit } from '@angular/core';

import { AlertController, PopoverController } from '@ionic/angular';

import { Group } from 'src/app/models/group.model';
import { GroupSheetService } from 'src/app/services/group-sheet.service';
import { SortListService } from 'src/app/services/sort-list.service';
import { StorageService } from 'src/app/services/storage.service';
import { ListPopoverComponent } from 'src/app/shared/list-popover/list-popover.component';
import text from 'src/assets/text/group-tab.text.json';

@Component({
    selector: 'app-group-tab',
    templateUrl: './group-tab.page.html',
    styleUrls: ['./group-tab.page.scss'],
})
export class GroupTabPage implements OnInit {

    groups: Group[];
    toggleSort: boolean;
    text: any;

    constructor(
        private alertController: AlertController,
        private groupSheetService: GroupSheetService,
        private popoverController: PopoverController,
        private sortListService: SortListService,
        private storageService: StorageService
    ) {
        this.toggleSort = true;
        this.text = text;
    }

    ngOnInit() {
        this.storageService.loadGroups();
        this.groups = this.storageService.getGroups();
        if (this.groups !== null && this.groups.length === 1) {
            this.groups = [];
            this.addGroup();
        }
        this.sortAscending();
    }

    sortAscending() {
        const firstGroup = this.groups[0];
        this.groups.shift();
        this.sortListService.sortAscending(this.groups);
        this.groups.unshift(firstGroup);
    }

    sortDescending() {
        const firstGroup = this.groups[0];
        this.groups.shift();
        this.sortListService.sortDescending(this.groups);
        this.groups.unshift(firstGroup);
    }

    async addGroup() {
        const alert = await this.alertController.create({
            header: this.text.addText,
            backdropDismiss: false,
            inputs: [
                {
                    name: 'name'
                }
            ],
            buttons: [
                {
                    text: this.text.cancelText,
                    role: 'cancel'
                }, {
                    text: this.text.acceptText,
                    handler: (data: any) => {
                        const group = new Group();
                        group.name = data.name;

                        if (group.name !== '' && this.storageService.findGroupByName(group.name) === undefined) {
                            this.createGroup(group);
                            this.sortToggler(this.toggleSort);
                        }
                    }
                }
            ]
        });

        await alert.present();
    }

    createGroup(group: Group): void {
        this.groups = this.storageService.addGroup(group);
    }

    async callMainActionSheet(position: number, group: Group): Promise<void> {
        if (position !== 0) {
            let result = await this.groupSheetService.mainActionSheet(group);
            switch (result.action) {
                case 'edit':
                    const passConfigs = this.storageService.findPassConfigByGroupId(group.id);
                    passConfigs.forEach(passConfig => {
                        passConfig.group.name = result.group.name;
                        this.storageService.updatePassConfig(passConfig);
                    });
                    this.groups = this.storageService.updateGroup(result.group);
                    this.sortToggler(this.toggleSort);
                    break;
                case 'delete':
                    this.groups = this.storageService.removeGroup(result.group);
                    break;
                default:
                    break;
            }
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
            default:
                break;
        }
    }

    sortToggler(ascending: boolean): void {
        this.toggleSort = ascending;
        if (ascending) {
            this.sortAscending();
        } else {
            this.sortDescending();
        }
    }

    groupPassConfigsLength(group: Group): number {
        let passConfigs = this.storageService.findPassConfigByGroupId(group.id);
        if (group.name === 'Sin agrupar') {
            passConfigs = passConfigs.concat(this.storageService.findPassConfigByGroupId(undefined));
        }
        return passConfigs.length;
    }
}
