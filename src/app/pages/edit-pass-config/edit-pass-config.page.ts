import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { StrategySelector } from 'src/app/core/strategy/strategy-selector';
import { PassConfig } from 'src/app/models/pass-config.model';
import { PassConfigService } from 'src/app/services/pass-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { RegeneratePopoverComponent } from 'src/app/shared/regenerate-popover/regenerate-popover.component';
import { PasswordValidatorService } from 'src/app/shared/validator/password-validator.service';
import text from 'src/assets/text/edit-pass-config.text.json';

@Component({
    selector: 'app-edit-pass-config',
    templateUrl: './edit-pass-config.page.html',
    styleUrls: ['./edit-pass-config.page.scss'],
})
export class EditPassConfigPage implements OnInit {

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
    text: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private alertController: AlertController,
        private clipboard: Clipboard,
        private navController: NavController,
        private passConfigService: PassConfigService,
        private passwordValidator: PasswordValidatorService,
        private popoverController: PopoverController,
        private router: Router,
        private storageService: StorageService,
        private toastController: ToastController
    ) {
        this.passConfig = new PassConfig();
        this.initEditForm();
    }

    ngOnInit() {
        this.submitForm = false;
        this.enableSettingsIcon = false;
        this.disablePassword = true;
        this.eyeIconName = 'eye-off-outline'
        this.text = text;
    }

    ionViewWillEnter() {
        // resetea el estado del componente contraseña del formulario
        this.showPassword = false;
        this.passwordType = 'password';
        this.passwordClass = 'field-input';
        this.eyeIconName = 'eye-off-outline'
        this.secret = this.activatedRoute.snapshot.paramMap.get('secret');

        // se ejecuta cuando se vuelve a recargar la página cuando se vuelve de la
        //  página para generar una contraseña
        if (this.passConfigService.getPassConfig() !== undefined) {
            // establece el estado del componente contraseña del formulario
            this.passConfig = this.passConfigService.getPassConfig();
            if (this.passConfig.keyConfig.keyword !== '') {
                this.enableSettingsIcon = true;
            }
        }

        // actualiza los valores de los campos del formulario
        this.getFormControl('name').setValue(this.passConfig.name);
        this.getFormControl('username').setValue(this.passConfig.username);
        this.getFormControl('uri').setValue(this.passConfig.uri);
        this.getFormControl('notes').setValue(this.passConfig.notes);

        let password;
        if (this.secret !== null) {
            password = this.regeneratePassword();
        } else {
            password = Array(this.passConfig.keyConfig.length + 1).join('*');
        }

        this.getFormControl('password').setValue(password);

        // se ejecuta en caso de que se haya enviado el formulario
        if (this.submitForm) {
            // establece el formulario como enviado y recorre todos los componentes
            //  para forzar la validación en aquellos componentes que hay que validar
            if (this.editForm.invalid || this.passwordRequired) {
                Object.values(this.editForm.controls).forEach(control => {
                    control.markAsTouched();
                });
                return;
            }
        }
    }

    ionViewDidLeave() {
        // resetea el formulario y el objeto PassConfig del servicio PassConfigService
        this.editForm.reset();
        this.passConfigService.setPassConfig(undefined);
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
            notes: new FormControl(this.passConfig.notes)
        });
    }

    saveEditForm(): void {
        // establece el formulario como enviado y recorre todos los componentes
        //  para forzar la validación en aquellos componentes que hay que validar
        this.submitForm = true;
        if (this.editForm.invalid || this.passwordRequired) {
            Object.values(this.editForm.controls).forEach(control => {
                control.markAsTouched();
            });
            return;
        }

        // actualiza el objeto PassConfig de la página con los valores de los
        //  componentes del formulario
        this.passConfig.update(this.editForm.value);
        this.passConfig.image = this.passConfig.buildImage(this.passConfig.uri);

        // almacena la configuración de la contraseña en el almacenamiento interno
        //  de la aplicación
        this.storageService.updatePassConfig(this.passConfig);

        // redirige al listado de configuraciones de contraseñas
        this.navigateToListTab();
    }

    getFormControl(formControlName: string): AbstractControl {
        return this.editForm.get(formControlName);
    }

    generatePassword(): void {
        // actualiza el objeto PassConfig de la página con los valores de los
        //  componentes del formulario y lo establece como objeto del servicio
        //  PassConfigService
        this.passConfig.update(this.editForm.value);
        this.passConfigService.setPassConfig(this.passConfig);

        // redirige al generador de contraseñas
        this.navigateToPasswordPage();
    }

    togglePassword(): void {
        // alterna el estado del componente contraseña del formulario
        if (this.passConfig.keyConfig.keyword !== '') {
            this.showPassword = !this.showPassword;
            this.eyeIconName = this.showPassword ? 'eye-outline' : 'eye-off-outline';
            this.passwordType = this.showPassword ? 'text' : 'password';
            this.passwordClass = !this.showPassword ? 'field-input' : '';
        }
    }

    copyUsername() {
        this.clipboard.copy(this.getFormControl('username').value);
        this.presentToast('Nombre de usuario copiado');
    }

    copyPassword() {
        if (this.secret !== null) {
            this.clipboard.copy(this.getFormControl('password').value);
            this.presentToast('Contraseña copiada');
        } else {
            this.regeneratePopover(true);
        }
    }

    copyUri() {
        this.clipboard.copy(this.getFormControl('uri').value);
        this.presentToast('URI copiada');
    }

    navigateToListTab(): void {
        //this.navController.navigateBack('tabs/safe-tab');
        this.navController.back();
    }

    navigateToPasswordPage(): void {
        let url = 'tabs/password-tab/create';
        if (this.secret !== null) {
            url += `/${this.secret}`;
        }

        this.router.navigateByUrl(url);
    }

    async regeneratePopover(copy: boolean) {
        // se ejecuta cuando el usuario no ha introducido su secreto para poder
        //  regenerar la contrasña
        if (this.secret === null) {
            // genera el popover
            const popover = await this.popoverController.create({
                component: RegeneratePopoverComponent,
                translucent: true,
                keyboardClose: false
            });
            popover.style.cssText = '--width: 78vw;';

            // muestra el popover
            await popover.present();

            // recupera la respuesta del popover
            const { data } = await popover.onDidDismiss();
            // se ejecuta en caso de que el usuario haya introducido el secreto
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

    // regenera la contraseña mediante su configuración y el secreto proporcionado
    //  por el usuario
    regeneratePassword(): string {
        const selector = new StrategySelector(this.passConfig.keyConfig.strategy);
        return selector.init(this.passConfig.keyConfig, this.secret);
    }

    async changePopover() {
        // genera el popover
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

        // muestra el popover
        await alert.present();
    }

    async presentToast(message: string) {
        console.log('RegeneratePassPage -> presentToast');
        const toast = await this.toastController.create({
            message: message,
            duration: 2000
        });

        await toast.present();
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
