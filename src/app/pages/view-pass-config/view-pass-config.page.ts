import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { NavController, PopoverController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { BasePage } from '../base-page';
import { StrategySelector } from 'src/app/core/strategy/strategy-selector';
import { ActionSheetService } from 'src/app/services/action-sheet.service';
import { GroupStorageService } from 'src/app/services/group-storage.service';
import { PassConfigService } from 'src/app/services/pass-config.service';
import { PassConfigStorageService } from 'src/app/services/pass-config-storage.service';
import { ActionPopoverComponent } from 'src/app/shared/action-popover/action-popover.component';
import { ValidatorService } from 'src/app/shared/validator/validator.service';
import { ToastService } from 'src/app/services/toast.service';

import { PassConfig } from 'src/app/models/pass-config.model';

import text from 'src/assets/text/view-pass-config.text.json';

@Component({
    selector: 'app-view-pass-config',
    templateUrl: './view-pass-config.page.html',
    styleUrls: ['./view-pass-config.page.scss'],
})
export class ViewPassConfigPage extends BasePage implements OnInit {

    viewForm: FormGroup;
    passConfig: PassConfig;
    submitForm: boolean;
    showPassword: boolean;
    disableComponent: boolean;
    passwordClass: string;
    eyeIconName: string;
    secret: string;
    text: any;

    constructor(
        private actionSheetService: ActionSheetService,
        private clipboard: Clipboard,
        private groupStorageService: GroupStorageService,
        private inAppBrowser: InAppBrowser,
        private navController: NavController,
        private passConfigService: PassConfigService,
        private passConfigStorageService: PassConfigStorageService,
        public validatorService: ValidatorService,
        public popoverController: PopoverController,
        private router: Router,
        private titleService: Title,
        private toastService: ToastService
    ) {
        super(validatorService, popoverController);
        this.passConfig = new PassConfig();
        this.initViewForm();
    }

    ngOnInit() {
        this.submitForm = false;
        this.showPassword = false;
        this.disableComponent = true;
        this.eyeIconName = 'eye-off-outline'
        this.passwordClass = 'field-input';
        this.text = text;
    }

    ionViewWillEnter() {
        this.titleService.setTitle('View Page');
        this.showPassword = false;
        this.passwordClass = 'field-input';
        this.eyeIconName = 'eye-off-outline';

        if (this.passConfigService.getPassConfig() !== undefined &&
            this.passConfigStorageService.findById(this.passConfig.id) === null) {
            this.passConfig = this.passConfigService.getPassConfig();
        } else {
            this.passConfig = this.passConfigStorageService.findById(this.passConfig.id);
        }

        let groupName: string;
        if (this.passConfig.group.id === undefined) {
            groupName = this.groupStorageService.findAll()[0].name;
        } else {
            const group = this.groupStorageService.findById(this.passConfig.group.id);
            if (group !== undefined) {
                groupName = this.groupStorageService.findById(this.passConfig.group.id).name;
            } else {
                groupName = this.groupStorageService.findAll()[0].name;
            }
        }

        super.getFormControl(this.viewForm, 'name').setValue(this.passConfig.name);
        super.getFormControl(this.viewForm, 'favorite').setValue(this.passConfig.favorite);
        super.getFormControl(this.viewForm, 'security').setValue(this.passConfig.security);
        super.getFormControl(this.viewForm, 'groupName').setValue(groupName);
        super.getFormControl(this.viewForm, 'updatedOn').setValue(this.passConfig.updatedOn);

        if (this.submitForm) {
            if (this.viewForm.invalid) {
                Object.values(this.viewForm.controls).forEach(control => {
                    control.markAsTouched();
                });
                return;
            }
        }
    }

    ionViewDidEnter() {
        let password;
        if (this.secret !== undefined) {
            password = this.regeneratePassword();
        } else {
            password = this.maskPassword();
        }

        super.getFormControl(this.viewForm, 'username').setValue(this.passConfig.username);
        super.getFormControl(this.viewForm, 'password').setValue(password);
        super.getFormControl(this.viewForm, 'uri').setValue(this.passConfig.uri);
        super.getFormControl(this.viewForm, 'notes').setValue(this.passConfig.notes);
    }

    ionViewDidLeave() {
        super.onIonViewDidLeave(this.viewForm, this.passConfigService);
    }

    initViewForm(): void {
        this.viewForm = super.onInitForm(this.passConfig);
        this.viewForm.addControl('favorite', new FormControl(false));
        this.viewForm.addControl('security', new FormControl(false));
        this.viewForm.addControl('groupName', new FormControl(''));
        this.viewForm.addControl('updatedOn', new FormControl(this.passConfig.updatedOn));
    }

    togglePassword(): void {
        if (this.passConfig.keyConfig.keyword !== '') {
            this.showPassword = !this.showPassword;
            this.eyeIconName = this.showPassword ? 'eye-outline' : 'eye-off-outline';
            this.passwordClass = !this.showPassword ? 'field-input' : '';

            let password = this.showPassword ? this.regeneratePassword() : this.maskPassword();
            super.getFormControl(this.viewForm, 'password').setValue(password);
        }
    }

    copyUsername() {
        this.clipboard.copy(super.getFormControl(this.viewForm, 'username').value);
        this.toastService.presentToast(this.text.copyNameText);
    }

    copyPassword() {
        if (this.secret !== undefined) {
            this.clipboard.copy(super.getFormControl(this.viewForm, 'password').value);
            this.toastService.presentToast(this.text.copyPasswordText);
        } else {
            this.regeneratePopover(true);
        }
    }

    copyUri() {
        this.clipboard.copy(super.getFormControl(this.viewForm, 'uri').value);
        this.toastService.presentToast(this.text.copyUriText);
    }

    openInBrowser() {
        let uri = this.passConfig.uri;
        if (!/^(http|https):\/\//.test(uri)) {
            uri = `https://${uri}`;
        }
        this.inAppBrowser.create(uri, '_system', { zoom: 'no' });
    }

    navigateToListTab(): void {
        this.navController.back();
    }

    navigateToEditPage(): void {
        let url = 'tabs/safe-tab/edit';
        if (this.secret !== undefined) {
            url += `/${this.secret}`;
        }

        this.router.navigateByUrl(url);
    }

    regenerate(secret: string, copy: boolean) {
        this.secret = secret;
        super.getFormControl(this.viewForm, 'password').setValue(this.regeneratePassword());

        if (copy) {
            this.copyPassword();
        } else {
            this.togglePassword();
        }
    }

    async regeneratePopover(copy: boolean) {
        super.onRegeneratePopover(this.secret, copy);
    }

    regeneratePassword(): string {
        const selector = new StrategySelector(this.passConfig.keyConfig.strategy);
        return selector.init(this.passConfig.keyConfig, this.secret);
    }

    maskPassword(): string {
        return Array(this.passConfig.keyConfig.length + 1).join('*');
    }

    async actionPopover(event: any) {
        const popover = await this.popoverController.create({
            component: ActionPopoverComponent,
            event: event,
            translucent: true,
            componentProps: { passcConfig: this.passConfig }
        });

        await popover.present();

        const { data } = await popover.onDidDismiss();

        switch (data !== undefined && data.item.action) {
            case 'edit':
                this.passConfig = this.passConfigStorageService.findById(this.passConfig.id);
                super.getFormControl(this.viewForm, 'name').setValue(this.passConfig.name);
                super.getFormControl(this.viewForm, 'username').setValue(this.passConfig.username);
                super.getFormControl(this.viewForm, 'uri').setValue(this.passConfig.uri);
                super.getFormControl(this.viewForm, 'notes').setValue(this.passConfig.notes);

                this.passConfigService.setPassConfig(this.passConfig);
                this.navigateToEditPage();
                break;
            case 'delete':
                this.actionSheetService.deleteAction(data.item.passConfig);
                break;
            default:
                break;
        }

        this.popoverController.dismiss();
    }

    get showSecurityInfo() {
        return this.getFormControl(this.viewForm, 'security').value;
    }

    validDateWarning(): string {
        return super.onValidDateWarning(this.passConfig);
    }
}
