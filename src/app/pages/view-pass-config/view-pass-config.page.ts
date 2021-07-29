import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NavController, PopoverController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { StrategySelector } from 'src/app/core/strategy/strategy-selector';
import { PassConfig } from 'src/app/models/pass-config.model';
import { ActionSheetService } from 'src/app/services/action-sheet.service';
import { FileService } from 'src/app/services/file.service';
import { PassConfigService } from 'src/app/services/pass-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { ActionPopoverComponent } from 'src/app/shared/action-popover/action-popover.component';
import { RegeneratePopoverComponent } from 'src/app/shared/regenerate-popover/regenerate-popover.component';
import { PasswordValidatorService } from 'src/app/shared/validator/password-validator.service';
import { ToastService } from 'src/app/services/toast.service';
import text from 'src/assets/text/view-pass-config.text.json';

@Component({
    selector: 'app-view-pass-config',
    templateUrl: './view-pass-config.page.html',
    styleUrls: ['./view-pass-config.page.scss'],
})
export class ViewPassConfigPage implements OnInit {

    editForm: FormGroup;
    passConfig: PassConfig;
    submitForm: boolean;
    showPassword: boolean;
    disableComponent: boolean;
    passwordType: string;
    passwordClass: string;
    eyeIconName: string;
    secret: string;
    text: any;

    constructor(
        private actionSheetService: ActionSheetService,
        private clipboard: Clipboard,
        private fileService: FileService,
        private navController: NavController,
        private passConfigService: PassConfigService,
        private passwordValidator: PasswordValidatorService,
        private popoverController: PopoverController,
        private router: Router,
        private storageService: StorageService,
        private toastService: ToastService
    ) {
        this.passConfig = new PassConfig();
        this.initEditForm();
    }

    ngOnInit() {
        this.submitForm = false;
        this.showPassword = false;
        this.disableComponent = true;
        this.passwordType = 'password';
        this.eyeIconName = 'eye-off-outline'
        this.passwordClass = 'field-input';
        this.text = text;
    }

    ionViewWillEnter() {
        this.showPassword = false;
        this.passwordType = 'password';
        this.passwordClass = 'field-input';
        this.eyeIconName = 'eye-off-outline'
        if (this.passConfigService.getPassConfig() !== undefined) {
            this.passConfig = this.passConfigService.getPassConfig();
        }

        this.getFormControl('name').setValue(this.passConfig.name);
        this.getFormControl('username').setValue(this.passConfig.username);
        this.getFormControl('uri').setValue(this.passConfig.uri);
        this.getFormControl('notes').setValue(this.passConfig.notes);
        this.getFormControl('updatedOn').setValue(this.passConfig.updatedOn);

        let password;
        if (this.secret !== undefined) {
            password = this.regeneratePassword();
        } else {
            password = Array(this.passConfig.keyConfig.length + 1).join('*');
        }

        this.getFormControl('password').setValue(password);

        if (this.submitForm) {
            if (this.editForm.invalid || this.passwordRequired) {
                Object.values(this.editForm.controls).forEach(control => {
                    control.markAsTouched();
                });
                return;
            }
        }
    }

    ionViewDidLeave() {
        this.editForm.reset();
        this.passConfigService.setPassConfig(undefined);
        this.popoverController.dismiss();
    }

    initEditForm(): void {
        this.editForm = new FormGroup({
            name: new FormControl(this.passConfig.name,
                Validators.required),
            username: new FormControl(this.passConfig.username),
            password: new FormControl(
                this.passConfig.keyConfig.keyword,
                this.passwordValidator.emptyPassword
            ),
            uri: new FormControl(this.passConfig.uri),
            notes: new FormControl(this.passConfig.notes),
            updatedOn: new FormControl(this.passConfig.updatedOn)
        });
    }

    getFormControl(formControlName: string): AbstractControl {
        return this.editForm.get(formControlName);
    }

    togglePassword(): void {
        if (this.passConfig.keyConfig.keyword !== '') {
            this.showPassword = !this.showPassword;
            this.eyeIconName = this.showPassword ? 'eye-outline' : 'eye-off-outline';
            this.passwordType = this.showPassword ? 'text' : 'password';
            this.passwordClass = !this.showPassword ? 'field-input' : '';
        }
    }

    copyUsername() {
        this.clipboard.copy(this.getFormControl('username').value);
        this.toastService.presentToast(this.text.copyNameText);
    }

    copyPassword() {
        if (this.secret !== undefined) {
            this.clipboard.copy(this.getFormControl('password').value);
            this.toastService.presentToast(this.text.copyPasswordText);
        } else {
            this.regeneratePopover(true);
        }
    }

    copyUri() {
        this.clipboard.copy(this.getFormControl('uri').value);
        this.toastService.presentToast(this.text.copyUriText);
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
    async regeneratePopover(copy: boolean) {
        if (this.secret === undefined) {
            const popover = await this.popoverController.create({
                component: RegeneratePopoverComponent,
                translucent: true,
                keyboardClose: false
            });
            popover.style.cssText = '--width: 78vw;';

            await popover.present();

            const { data } = await popover.onDidDismiss();
            if (data !== undefined && data.item.secret) {
                this.secret = data.item.secret;

                this.getFormControl('password').setValue(this.regeneratePassword());

                if (copy) {
                    this.copyPassword();
                } else {
                    this.togglePassword();
                }
            }
        } else {
            this.togglePassword();
        }
    }

    regeneratePassword(): string {
        const selector = new StrategySelector(this.passConfig.keyConfig.strategy);
        return selector.init(this.passConfig.keyConfig, this.secret);
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
                this.passConfig = this.storageService.getPassConfig(this.passConfig.id);
                this.getFormControl('name').setValue(this.passConfig.name);
                this.getFormControl('username').setValue(this.passConfig.username);
                this.getFormControl('uri').setValue(this.passConfig.uri);
                this.getFormControl('notes').setValue(this.passConfig.notes);

                this.passConfigService.setPassConfig(this.passConfig);
                this.navigateToEditPage();
                break;
            case 'favorite':
                this.actionSheetService.favoriteConfigAction(data.item.passConfig);
                break;
            case 'export':
                this.fileService.exportToJsonFile();
                break;
            case 'delete':
                this.actionSheetService.deleteConfigAlert(data.item.passConfig);
                break;
            default:
                break;
        }
    }

    invalidName(formControlname: string): boolean {
        return this.getFormControl(formControlname).invalid &&
            this.getFormControl(formControlname).touched && this.submitForm;
    }

    get nameRequired(): boolean {
        return this.invalidName('name') && this.getFormControl('name').errors?.required;
    }

    get passwordRequired(): boolean {
        return this.invalidName('password') && this.getFormControl('password').errors?.emptyPassword;
    }
}
