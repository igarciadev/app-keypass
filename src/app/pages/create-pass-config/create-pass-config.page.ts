import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AlertController, NavController, PopoverController } from '@ionic/angular';

import { BasePage } from '../base-page';
import { StrategySelector } from 'src/app/core/strategy/strategy-selector';
import { NotificationService } from 'src/app/services/notification.service';
import { SortListService } from 'src/app/services/sort-list.service';
import { StorageService } from 'src/app/services/storage.service';
import { PassConfigService } from 'src/app/services/pass-config.service';
import { PasswordValidatorService } from 'src/app/shared/validator/password-validator.service';

import { Group } from 'src/app/models/group.model';
import { PassConfig } from 'src/app/models/pass-config.model';

import text from 'src/assets/text/create-pass-config.text.json';

@Component({
    selector: 'app-create-pass-config',
    templateUrl: './create-pass-config.page.html',
    styleUrls: ['./create-pass-config.page.scss']
})
export class CreatePassConfigPage extends BasePage implements OnInit {

    createForm: FormGroup;
    passConfig: PassConfig;
    submitForm: boolean;
    enableEyeIcon: boolean;
    enableSettingsIcon: boolean;
    showPassword: boolean;
    disablePassword: boolean;
    passwordType: string;
    passwordClass: string;
    eyeIconName: string;
    secret: string;
    groups: Group[];
    text: any;

    constructor(
        private alertController: AlertController,
        private navController: NavController,
        private notificationService: NotificationService,
        private passConfigService: PassConfigService,
        public passwordValidator: PasswordValidatorService,
        public popoverController: PopoverController,
        private router: Router,
        private sortListService: SortListService,
        private storageService: StorageService,
        private titleService: Title
    ) {
        super(passwordValidator, popoverController);
        this.passConfig = new PassConfig();
        this.initCreateForm();
    }

    ngOnInit() {
        this.submitForm = false;
        this.enableEyeIcon = false;
        this.enableSettingsIcon = false;
        this.showPassword = false;
        this.disablePassword = true;
        this.passwordType = 'password';
        this.eyeIconName = 'eye-off-outline'
        this.passwordClass = 'field-input';
        this.groups = this.storageService.getGroups();
        this.text = text;
    }

    ionViewWillEnter() {
        this.titleService.setTitle('Create Page');
        if (this.passConfigService.getPassConfig() !== undefined) {
            this.passwordType = 'password';
            this.secret = undefined;
            this.enableEyeIcon = false;
            this.showPassword = false;
            this.passwordClass = 'field-input';

            this.passConfig = this.passConfigService.getPassConfig();
            if (this.passConfig.keyConfig.keyword !== '') {
                this.enableEyeIcon = true;
                this.enableSettingsIcon = true;
                this.eyeIconName = 'eye-off-outline'
            }
        }

        if (this.passConfig.group !== undefined && this.passConfig.group.id === undefined) {
            this.passConfig.group = this.storageService.getGroups()[0];
        } else {
            const group = this.storageService.findGroupById(this.passConfig.group.id);
            if (group !== undefined) {
                this.passConfig.group = this.storageService.findGroupById(this.passConfig.group.id);
            } else {
                this.passConfig.group = this.storageService.getGroups()[0];
            }
        }

        super.getFormControl(this.createForm, 'name').setValue(this.passConfig.name);
        super.getFormControl(this.createForm, 'username').setValue(this.passConfig.username);
        super.getFormControl(this.createForm, 'uri').setValue(this.passConfig.uri);
        super.getFormControl(this.createForm, 'notes').setValue(this.passConfig.notes);
        super.getFormControl(this.createForm, 'favorite').setValue(this.passConfig.favorite);
        super.getFormControl(this.createForm, 'security').setValue(this.passConfig.security);
        super.getFormControl(this.createForm, 'groupId').setValue(this.passConfig.group.id);

        if (this.passConfig.keyConfig.keyword !== '') {
            let password;
            if (this.secret !== undefined) {
                password = this.regeneratePassword(this.secret);
            } else {
                password = Array(this.passConfig.keyConfig.length + 1).join('*');
            }

            super.getFormControl(this.createForm, 'password').setValue(password);
        }

        if (this.submitForm) {
            if (this.createForm.invalid || this.passwordRequired) {
                Object.values(this.createForm.controls).forEach(control => {
                    control.markAsTouched();
                });
                return;
            }
        }

        this.sortAscending();
    }

    ionViewDidLeave() {
        super.onIonViewDidLeave(this.createForm, this.passConfigService);
    }

    initCreateForm(): void {
        this.createForm = super.onInitForm(this.passConfig);
        this.createForm.addControl('favorite', new FormControl(false));
        this.createForm.addControl('security', new FormControl(false));
        this.createForm.addControl('groupId', new FormControl(this.passConfig.group.id));
    }

    saveCreateForm(): void {
        this.submitForm = true;
        if (this.createForm.invalid || this.passwordRequired) {
            Object.values(this.createForm.controls).forEach(control => {
                control.markAsTouched();
            });
            return;
        }

        this.passConfig.update(this.createForm.value);
        this.passConfig.image = this.passConfig.buildImage(this.passConfig.uri);

        this.storageService.addPassConfig(this.passConfig);
        this.notificationService.createLocalNotification(this.passConfig);
        this.navigateToListTab();
    }

    generatePassword(): void {

        super.getFormControl(this.createForm, 'groupId').setValue(this.passConfig.group.id);

        this.passConfig.update(this.createForm.value);
        this.passConfigService.setPassConfig(this.passConfig);

        this.navigateToPasswordPage();
    }

    regeneratePassword(secret: string): string {
        const selector = new StrategySelector(this.passConfig.keyConfig.strategy);
        return selector.init(this.passConfig.keyConfig, secret);
    }

    togglePassword(): void {
        if (this.passConfig.keyConfig.keyword !== '') {
            this.showPassword = !this.showPassword;
            this.eyeIconName = this.showPassword ? 'eye-outline' : 'eye-off-outline';
            this.passwordType = this.showPassword ? 'text' : 'password';
            this.passwordClass = !this.showPassword ? 'field-input' : '';
        }
    }

    sortAscending() {
        const firstGroup = this.groups[0];
        this.groups.shift();
        this.sortListService.sortAscending(this.groups);
        this.groups.unshift(firstGroup);
    }

    navigateToListTab(): void {
        this.navController.navigateBack('tabs/safe-tab');
    }

    navigateToPasswordPage(): void {
        let url = 'tabs/password-tab/create';
        if (this.secret !== undefined) {
            url += `/${this.secret}`;
        }

        this.router.navigateByUrl(url);
    }

    updatePassConfigGroup(): void {
        const group = this.storageService.findGroupById(super.getFormControl(this.createForm, 'groupId').value);
        if (group !== undefined) {
            this.passConfig.group = group;
        }
    }

    regenerate(secret: string, copy: boolean) {
        this.secret = secret;
        const password = this.regeneratePassword(this.secret);
        super.getFormControl(this.createForm, 'password').setValue(password);
        this.togglePassword();
    }

    async regeneratePopover(copy: boolean) {
        super.onRegeneratePopover(this.secret, copy);
    }

    async changePopover() {
        const alert = await this.alertController.create({
            header: this.text.overwriteText,
            message: this.text.areYorSureText,
            backdropDismiss: false,
            buttons: [
                {
                    text: this.text.noText,
                    role: 'cancel'
                }, {
                    text: this.text.yesText,
                    handler: () => {
                        this.generatePassword();
                    }
                }
            ]
        });

        await alert.present();
    }

    invalidName(formControlname: string): boolean {
        return super.getFormControl(this.createForm, formControlname).invalid &&
            super.getFormControl(this.createForm, formControlname).touched && this.submitForm;
    }

    get nameRequired(): boolean {
        return super.onInvalidName(this.createForm, 'name') && this.submitForm;
    }

    get passwordRequired(): boolean {
        return super.onPasswordRequired(this.createForm, 'password') && this.submitForm;
    }
}
