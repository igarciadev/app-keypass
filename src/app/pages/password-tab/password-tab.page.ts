import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AlertController, NavController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { CipherStrategy } from 'src/app/core/cipher/impl/cipher.strategy';
import { StrategySelector } from 'src/app/core/strategy/strategy-selector';
import { UkeleleStrategy } from 'src/app/core/strategy/impl/ukelele-strategy';
import { PassConfigService } from 'src/app/services/pass-config.service';
import { UrlService } from 'src/app/services/url.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';

import { PassConfig } from 'src/app/models/pass-config.model';

import { environment } from 'src/environments/environment';

import text from 'src/assets/text/password-tab.text.json';

@Component({
    selector: 'app-password-tab',
    templateUrl: 'password-tab.page.html',
    styleUrls: ['password-tab.page.scss']
})
export class PasswordTabPage implements OnInit {

    passwordForm: FormGroup;
    passConfigId: number;
    secret: string;
    password: string;
    passConfig: PassConfig;
    passConfigToSave: PassConfig;
    disableLength: boolean;
    keywordType: string;
    submitForm: boolean;
    page: string;
    passwordDisabled: boolean;
    passwordEnableCopyIcon: boolean
    keywordClass: string;
    eyeIconName: string;
    showPassword: boolean;
    previousUrl: string;
    text: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private alertController: AlertController,
        private clipboard: Clipboard,
        private navController: NavController,
        private passConfigService: PassConfigService,
        private storageService: StorageService,
        private titleService: Title,
        private toastService: ToastService,
        private urlService: UrlService
    ) {
        this.initPasswordForm();
    }

    ngOnInit() {
        let passConfigId = this.getUrlParameter('passConfigId');
        this.secret = this.getUrlParameter('secret');
        this.page = this.getUrlParameter('page');

        if (this.passConfigService.getPassConfig()) {
            this.passConfig = this.passConfigService.getPassConfig();
        } else if (passConfigId !== null) {
            this.passConfigId = Number(passConfigId);
            this.passConfig = this.storageService.getPassConfig(this.passConfigId);
        } else {
            this.passConfig = new PassConfig();
        }

        this.passConfig.keyConfig.cipher = new CipherStrategy();
        this.passConfig.keyConfig.strategy = new UkeleleStrategy();
        this.passConfig.keyConfig.salt = environment.salt;
        this.passConfig.keyConfig.iv = environment.iv;

        this.password = '';
        this.disableLength = true;
        this.keywordType = 'password';
        this.submitForm = false;
        this.passwordDisabled = true;
        this.passwordEnableCopyIcon = this.page !== 'edit';
        this.showPassword = false;
        this.keywordClass = 'field-input';
        this.eyeIconName = 'eye-off-outline'
        this.text = text;

        this.updatePasswordForm();

        this.urlService.previousUrl$
            .subscribe((previousUrl: string) => {
                this.previousUrl = previousUrl;
            });
    }

    ionViewWillEnter() {
        this.titleService.setTitle('Password Page');
    }

    initPasswordForm(): void {
        this.password = '';
        this.passwordForm = new FormGroup({
            secret: new FormControl('', Validators.compose([
                Validators.required,
                Validators.minLength(4)
            ])),
            keyword: new FormControl('', Validators.compose([
                Validators.required,
                Validators.minLength(4)
            ])),
            upper: new FormControl(''),
            lower: new FormControl(''),
            number: new FormControl(''),
            symbol: new FormControl(''),
            length: new FormControl({ value: '', disabled: true }),
            minNumbers: new FormControl({ value: '', disabled: true }),
            minSymbols: new FormControl({ value: '', disabled: true })
        });
    }

    updatePasswordForm(): void {
        this.getFormControl('secret').setValue(this.secret);
        this.getFormControl('keyword').setValue(this.passConfig.keyConfig.keyword);
        this.getFormControl('upper').setValue(this.passConfig.keyConfig.upper);
        this.getFormControl('lower').setValue(this.passConfig.keyConfig.lower);
        this.getFormControl('number').setValue(this.passConfig.keyConfig.number);
        this.getFormControl('symbol').setValue(this.passConfig.keyConfig.symbol);
        this.getFormControl('length').setValue(this.passConfig.keyConfig.length);
        this.getFormControl('minNumbers').setValue(this.passConfig.keyConfig.minNumbers);
        this.getFormControl('minSymbols').setValue(this.passConfig.keyConfig.minSymbols);
    }

    getUrlParameter(parameterName: string): string {
        return this.activatedRoute.snapshot.paramMap.get(parameterName);
    }

    generateNewPassword(): void {
        if (this.findInvalidControls().length > 0) {
            Object.values(this.passwordForm.controls)
                .forEach(control => { control.markAsTouched(); });
            return;
        }

        if (this.getFormStringValue('secret').length === 0 || this.getFormStringValue('keyword').length === 0) {
            return;
        }

        this.submitForm = true;

        this.updatePassword();
    }

    updatePassword(): void {
        if (this.submitForm) {
            let passConfig = new PassConfig(this.passConfig);

            passConfig.keyConfig.time = new Date().getTime();
            passConfig.keyConfig.keyword = this.getFormStringValue('keyword');
            passConfig.keyConfig.upper = this.getFormBooleanValue('upper');
            passConfig.keyConfig.lower = this.getFormBooleanValue('lower');
            passConfig.keyConfig.number = this.getFormBooleanValue('number');
            passConfig.keyConfig.symbol = this.getFormBooleanValue('symbol');
            passConfig.keyConfig.length = this.getFormNumberValue('length');
            passConfig.keyConfig.minNumbers = this.getFormNumberValue('minNumbers');
            passConfig.keyConfig.minSymbols = this.getFormNumberValue('minSymbols');

            const selector = new StrategySelector(passConfig.keyConfig.strategy);
            this.password = selector.init(passConfig.keyConfig, this.getFormStringValue('secret'));

            this.secret = this.getFormStringValue('secret');

            this.passConfigToSave = passConfig;
        }
    }

    savePassword(): void {
        this.submitForm = true;
        if (this.findInvalidControls().length > 0) {
            Object.values(this.passwordForm.controls)
                .forEach(control => { control.markAsTouched(); });
            return;
        }

        if (this.getFormStringValue('secret').length === 0 ||
            this.getFormStringValue('keyword').length === 0) {
            return;
        }

        if (this.password.length === 0) {
            this.generatePasswordPopover();
            return;
        }

        this.passConfigService.setPassConfig(this.passConfigToSave);

        this.navigateBack();
    }

    findInvalidControls(): string[] {
        const invalid = [];
        const controls = this.passwordForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }

        return invalid;
    }

    getFormControl(formControlName: string): AbstractControl {
        return this.passwordForm.get(formControlName);
    }

    getFormStringValue(formControlName: string): string {
        return String(this.getFormControl(formControlName).value);
    }

    getFormNumberValue(formControlName: string): number {
        return Number(this.getFormControl(formControlName).value);
    }

    getFormBooleanValue(formControlName: string): boolean {
        return Boolean(this.getFormControl(formControlName).value);
    }

    decrementLenght(): void {
        this.getFormControl('length').setValue(this.getFormNumberValue('length') - 1);

        let minNumbers: number;
        if (this.getFormBooleanValue('number')) {
            minNumbers = this.getFormNumberValue('minNumbers');
        }

        let minSymbols: number;
        if (this.getFormBooleanValue('symbol')) {
            minSymbols = this.getFormNumberValue('minSymbols');
        }

        if ((minNumbers + minSymbols + 1) >= this.getFormNumberValue('length')) {
            if (minNumbers > minSymbols) {
                this.getFormControl('minNumbers').setValue(minNumbers - 1);
            } else {
                this.getFormControl('minSymbols').setValue(minSymbols - 1);
            }
        }
    }

    increment(formControlname: string): void {
        this.getFormControl(formControlname).setValue(this.getFormNumberValue(formControlname) + 1);
    }

    incrementLenght(): void {
        this.increment('length');
    }

    incrementMinNumbers(): void {
        this.increment('minNumbers');
    }

    incrementMinSymbols(): void {
        this.increment('minSymbols');
    }

    decrement(formControlname: string): void {
        this.getFormControl(formControlname).setValue(this.getFormNumberValue(formControlname) - 1)
    }

    decrementMinNumbers(): void {
        this.decrement('minNumbers');
    }

    decrementMinSymbols(): void {
        this.decrement('minSymbols');
    }

    getMinLetters(): number {
        let minLetters = 0;
        if (this.getFormBooleanValue('upper')) {
            minLetters++;
        }

        if (this.getFormBooleanValue('lower')) {
            minLetters++;
        }

        return minLetters;
    }

    getMinNumbers(): number {
        let minNumbers = 0;
        if (this.getFormBooleanValue('number')) {
            minNumbers = this.getFormNumberValue('minNumbers');
        }

        return minNumbers;
    }

    getMinSymbols(): number {
        let minSymbols = 0;
        if (this.getFormBooleanValue('symbol')) {
            minSymbols = this.getFormNumberValue('minSymbols');
        }

        return minSymbols;
    }

    disableIncrement(formControlName: string): boolean {
        const minLetters = this.getMinLetters();
        const minNumbers = this.getMinNumbers();
        const minSymbols = this.getMinSymbols();

        return !this.getFormBooleanValue(formControlName) ||
            (this.getFormNumberValue('length') - minNumbers - minSymbols <= minLetters);
    }

    calculateValues(): void {
        if (!this.getFormBooleanValue('upper') &&
            !this.getFormBooleanValue('lower') &&
            !this.getFormBooleanValue('number') &&
            !this.getFormBooleanValue('symbol')) {
            this.getFormControl('lower').setValue(true);
        }

        if (!this.getFormBooleanValue('number')) {
            this.getFormControl('minNumbers').setValue(1);
        }

        if (!this.getFormBooleanValue('symbol')) {
            this.getFormControl('minSymbols').setValue(1);
        }

        let minLetters = this.getMinLetters();

        let totalMins = 0;
        if (this.getFormBooleanValue('number')) {
            totalMins += this.getFormNumberValue('minNumbers');
        }
        if (this.getFormBooleanValue('symbol')) {
            totalMins += this.getFormNumberValue('minSymbols');
        }

        if (totalMins + minLetters >= this.getFormNumberValue('length')) {
            const subtract = totalMins + minLetters - this.getFormNumberValue('length');
            if (this.getFormNumberValue('minNumbers') > this.getFormNumberValue('minSymbols')) {
                this.getFormControl('minNumbers').setValue(this.getFormNumberValue('minNumbers') - subtract);
            } else {
                this.getFormControl('minSymbols').setValue(this.getFormNumberValue('minSymbols') - subtract);
            }
        }
    }

    navigateBack(): void {
        this.navController.back();
    }

    copyPassword(): void {
        this.clipboard.copy(this.password);
        this.toastService.presentToast(this.text.copyPasswordText);
    }

    togglePassword(): void {
        this.showPassword = !this.showPassword;
        this.eyeIconName = this.showPassword ? 'eye-outline' : 'eye-off-outline';
        this.keywordType = this.showPassword ? 'text' : 'password';
        this.keywordClass = !this.showPassword ? 'field-input' : '';
    }

    async generatePasswordPopover() {
        const alert = await this.alertController.create({
            header: this.text.generateOnePassText,
            message: this.text.nextToGenerateText,
            backdropDismiss: false,
            buttons: [
                {
                    text: this.text.cancelText,
                    role: 'cancel'
                }, {
                    text: this.text.acceptText,
                    role: 'ok'
                }
            ]
        });

        await alert.present();
    }

    get invalidSecret(): boolean {
        return this.getFormControl('secret').invalid && this.getFormControl('secret').touched;
    }

    get invalidKeyword(): boolean {
        return this.getFormControl('keyword').invalid && this.getFormControl('keyword').touched;
    }

    get canSave(): boolean {
        return this.passwordForm.invalid || this.password.length === 0;
    }

    get disableLengthDecrement(): boolean {
        const minLetters = this.getMinLetters();
        const minNumbers = this.getMinNumbers();
        const minSymbols = this.getMinSymbols();

        return this.getFormNumberValue('length') <= this.passConfig.keyConfig.minLength ||
            (minLetters >= this.getFormNumberValue('length') - minNumbers - minSymbols);
    }

    get disableLengthIncrement(): boolean {
        return this.getFormNumberValue('length') >= this.passConfig.keyConfig.maxLength;
    }

    get disableNumbers(): boolean {
        return !this.getFormBooleanValue('number') || (!this.getFormBooleanValue('upper') &&
            !this.getFormBooleanValue('lower') && !this.getFormBooleanValue('symbol'));
    }

    get disableNumbersDecrement(): boolean {
        return !this.getFormBooleanValue('number') || this.getFormNumberValue('minNumbers') <= 1;
    }

    get disableNumbersIncrement(): boolean {
        return this.disableIncrement('number');
    }

    get disableSymbols(): boolean {
        return !this.getFormBooleanValue('symbol') || (!this.getFormBooleanValue('upper') &&
            !this.getFormBooleanValue('lower') && !this.getFormBooleanValue('number'));
    }

    get disableSymbolsDecrement(): boolean {
        return !this.getFormBooleanValue('symbol') || this.getFormNumberValue('minSymbols') <= 1;
    }

    get disableSymbolsIncrement(): boolean {
        return this.disableIncrement('symbol');
    }

    get secretRequired(): boolean {
        return this.invalidSecret && this.getFormControl('secret').errors?.required;
    }

    get secretMinLength(): boolean {
        return this.invalidSecret && this.getFormControl('secret').errors?.minlength;
    }

    get keywordRequired(): boolean {
        return this.invalidKeyword && this.getFormControl('keyword').errors?.required;
    }

    get keywordMinLength(): boolean {
        return this.invalidKeyword && this.getFormControl('keyword').errors?.minlength;
    }

    get show(): boolean {
        return this.previousUrl !== null && (this.previousUrl.includes('create') || this.previousUrl.includes('edit'));
    }
}
