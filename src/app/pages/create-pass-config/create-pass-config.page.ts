import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { AlertController, NavController, PopoverController } from '@ionic/angular';

import { RegeneratePopoverComponent } from 'src/app/shared/regenerate-popover/regenerate-popover.component';
import { StrategySelector } from 'src/app/core/strategy/strategy-selector';
import { StorageService } from 'src/app/services/storage.service';
import { PassConfigService } from 'src/app/services/pass-config.service';
import { PasswordValidatorService } from 'src/app/shared/validator/password-validator.service';

import { PassConfig } from 'src/app/models/pass-config.model';

import text from 'src/assets/text/create-pass-config.text.json';

@Component({
    selector: 'app-create-pass-config',
    templateUrl: './create-pass-config.page.html',
    styleUrls: ['./create-pass-config.page.scss']
})
export class CreatePassConfigPage implements OnInit {

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
    text: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private alertController: AlertController,
        private navController: NavController,
        private passConfigService: PassConfigService,
        private passwordValidator: PasswordValidatorService,
        private popoverController: PopoverController,
        private router: Router,
        private storageService: StorageService
    ) {
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
        this.text = text;
    }

    ionViewWillEnter() {
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

        this.getFormControl('name').setValue(this.passConfig.name);
        this.getFormControl('username').setValue(this.passConfig.username);
        this.getFormControl('uri').setValue(this.passConfig.uri);
        this.getFormControl('notes').setValue(this.passConfig.notes);

        if (this.passConfig.keyConfig.keyword !== '') {
            let password;
            if (this.secret !== undefined) {
                password = this.regeneratePassword(this.secret);
            } else {
                password = Array(this.passConfig.keyConfig.length + 1).join('*');
            }

            this.getFormControl('password').setValue(password);
        }

        if (this.submitForm) {
            if (this.createForm.invalid || this.passwordRequired) {
                Object.values(this.createForm.controls).forEach(control => {
                    control.markAsTouched();
                });
                return;
            }
        }
    }

    ionViewDidLeave() {
        this.createForm.reset();
        this.passConfigService.setPassConfig(undefined);
    }

    initCreateForm(): void {
        this.createForm = new FormGroup({
            name: new FormControl(this.passConfig.name,
                Validators.required),
            username: new FormControl(this.passConfig.username),
            password: new FormControl(
                this.passConfig.keyConfig.keyword,
                this.passwordValidator.emptyPassword
            ),
            uri: new FormControl(this.passConfig.uri),
            notes: new FormControl(this.passConfig.notes)
        });
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

        this.navigateToListTab();
    }

    getFormControl(formControlName: string): AbstractControl {
        return this.createForm.get(formControlName);
    }

    generatePassword(): void {
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

    async regeneratePopover() {
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

                const password = this.regeneratePassword(this.secret);
                this.getFormControl('password').setValue(password);
                this.togglePassword();
            }
        } else {
            this.togglePassword();
        }
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
