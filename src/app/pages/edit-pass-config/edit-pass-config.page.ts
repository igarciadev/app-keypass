import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AlertController, NavController, PopoverController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { BasePage } from '../base-page';
import { StrategySelector } from 'src/app/core/strategy/strategy-selector';
import { NotificationService } from 'src/app/services/notification.service';
import { PassConfigService } from 'src/app/services/pass-config.service';
import { SortListService } from 'src/app/services/sort-list.service';
import { StorageService } from 'src/app/services/storage.service';
import { PasswordValidatorService } from 'src/app/shared/validator/password-validator.service';
import { ToastService } from 'src/app/services/toast.service';

import { Group } from 'src/app/models/group.model';
import { PassConfig } from 'src/app/models/pass-config.model';

import text from 'src/assets/text/edit-pass-config.text.json';

@Component({
    selector: 'app-edit-pass-config',
    templateUrl: './edit-pass-config.page.html',
    styleUrls: ['./edit-pass-config.page.scss']
})
export class EditPassConfigPage extends BasePage implements OnInit {

    editForm: FormGroup;
    passConfig: PassConfig;
    submitForm: boolean;
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
        private activatedRoute: ActivatedRoute,
        private alertController: AlertController,
        private clipboard: Clipboard,
        private navController: NavController,
        private notificationService: NotificationService,
        private passConfigService: PassConfigService,
        public passwordValidator: PasswordValidatorService,
        public popoverController: PopoverController,
        private router: Router,
        private sortListService: SortListService,
        private storageService: StorageService,
        private titleService: Title,
        private toastService: ToastService
    ) {
        super(passwordValidator, popoverController);
        this.passConfig = new PassConfig();
        this.initEditForm();
    }

    ngOnInit() {
        this.submitForm = false;
        this.enableSettingsIcon = false;
        this.disablePassword = true;
        this.eyeIconName = 'eye-off-outline';
        this.groups = this.storageService.getGroups();
        this.text = text;
    }

    ionViewWillEnter() {
        this.titleService.setTitle('Edit Page');
        this.showPassword = false;
        this.passwordType = 'password';
        this.passwordClass = 'field-input';
        this.eyeIconName = 'eye-off-outline'
        this.secret = this.activatedRoute.snapshot.paramMap.get('secret');

        if (this.passConfigService.getPassConfig() !== undefined) {
            this.passConfig = this.passConfigService.getPassConfig();
            if (this.passConfig.keyConfig.keyword !== '') {
                this.enableSettingsIcon = true;
            }
        }

        if (this.passConfig.group !== undefined && this.passConfig.group === undefined) {
            this.passConfig.group = this.storageService.getGroups()[0];
        } else {
            const group = this.storageService.findGroupById(this.passConfig.group.id);
            if (group !== undefined) {
                this.passConfig.group = this.storageService.findGroupById(this.passConfig.group.id);
            } else {
                this.passConfig.group = this.storageService.getGroups()[0];
            }
        }

        super.getFormControl(this.editForm, 'name').setValue(this.passConfig.name);
        super.getFormControl(this.editForm, 'username').setValue(this.passConfig.username);
        super.getFormControl(this.editForm, 'uri').setValue(this.passConfig.uri);
        super.getFormControl(this.editForm, 'notes').setValue(this.passConfig.notes);
        super.getFormControl(this.editForm, 'favorite').setValue(this.passConfig.favorite);
        super.getFormControl(this.editForm, 'security').setValue(this.passConfig.security);
        super.getFormControl(this.editForm, 'groupId').setValue(this.passConfig.group.id);

        let password;
        if (this.secret !== null) {
            password = this.regeneratePassword();
        } else {
            password = Array(this.passConfig.keyConfig.length + 1).join('*');
        }

        super.getFormControl(this.editForm, 'password').setValue(password);

        if (this.submitForm) {
            if (this.editForm.invalid || this.passwordRequired) {
                Object.values(this.editForm.controls).forEach(control => {
                    control.markAsTouched();
                });
                return;
            }
        }

        this.sortAscending();
    }

    ionViewDidLeave() {
        this.editForm.reset();
        this.passConfigService.setPassConfig(undefined);
    }

    initEditForm(): void {
        this.editForm = super.onInitForm(this.passConfig);
        this.editForm.addControl('favorite', new FormControl(this.passConfig.favorite));
        this.editForm.addControl('security', new FormControl(this.passConfig.security));
        this.editForm.addControl('groupId', new FormControl(this.passConfig.group.id));
    }

    saveEditForm(): void {
        this.submitForm = true;
        if (this.editForm.invalid || this.passwordRequired) {
            Object.values(this.editForm.controls).forEach(control => {
                control.markAsTouched();
            });
            return;
        }

        this.passConfig.update(this.editForm.value);
        this.passConfig.image = this.passConfig.buildImage(this.passConfig.uri);

        if (this.passConfig.security && this.passConfig.keyConfig.updatedOn === undefined) {
            this.passConfig.keyConfig.updatedOn = this.passConfig.keyConfig.validSecurityDate();
        }

        this.storageService.updatePassConfig(this.passConfig);
        this.notificationService.createLocalNotification(this.passConfig);
        this.navigateToListTab();
    }

    generatePassword(): void {
        this.passConfig.update(this.editForm.value);
        this.passConfigService.setPassConfig(this.passConfig);

        this.navigateToPasswordPage();
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

    copyUsername() {
        this.clipboard.copy(super.getFormControl(this.editForm, 'username').value);
        this.toastService.presentToast(this.text.copyNameText);
    }

    copyPassword() {
        if (this.secret !== null) {
            this.clipboard.copy(super.getFormControl(this.editForm, 'password').value);
            this.toastService.presentToast(this.text.copyPasswordText);
        } else {
            this.regeneratePopover(true);
        }
    }

    copyUri() {
        this.clipboard.copy(super.getFormControl(this.editForm, 'uri').value);
        this.toastService.presentToast(this.text.copyUriText);
    }

    navigateToListTab(): void {
        this.navController.back();
    }

    navigateToPasswordPage(): void {
        let url = 'tabs/password-tab/create';
        if (this.secret !== null) {
            url += `/${this.secret}`;
        }

        this.router.navigateByUrl(url);
    }

    updatePassConfigGroup(): void {
        const group = this.storageService.findGroupById(super.getFormControl(this.editForm, 'groupId').value);
        if (group !== undefined) {
            this.passConfig.group = group;
        }
    }

    regenerate(secret: string, copy: boolean) {
        this.secret = secret;
        super.getFormControl(this.editForm, 'password').setValue(this.regeneratePassword());
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
                        this.alertController.dismiss();
                    }
                }
            ]
        });

        await alert.present();
    }

    get nameRequired(): boolean {
        return super.onInvalidName(this.editForm, 'name') && this.submitForm;
    }

    get passwordRequired(): boolean {
        return super.onPasswordRequired(this.editForm, 'password') && this.submitForm;
    }

    validDateWarning(): string {
        return super.onValidDateWarning(this.passConfigService.getPassConfig());
    }
}
