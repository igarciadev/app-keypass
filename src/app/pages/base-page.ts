import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";

import { PopoverController } from "@ionic/angular";

import { RegeneratePopoverComponent } from "../shared/regenerate-popover/regenerate-popover.component";
import { PassConfigService } from "../services/pass-config.service";
import { PasswordValidatorService } from "../shared/validator/password-validator.service";

import { PassConfig } from "../models/pass-config.model";

export abstract class BasePage {

    constructor(
        public passwordValidator: PasswordValidatorService,
        public popoverController: PopoverController) {
    }

    abstract regenerate(secret: string, copy: boolean): void;

    abstract togglePassword(): void;

    onIonViewDidLeave(form: FormGroup, passConfigService: PassConfigService) {
        form.reset();
        passConfigService.setPassConfig(undefined);
    }

    getFormControl(form: FormGroup, formControlName: string): AbstractControl {
        return form.get(formControlName);
    }

    onInitForm(passConfig: PassConfig): FormGroup {
        return new FormGroup({
            name: new FormControl(passConfig.name,
                Validators.required),
            username: new FormControl(passConfig.username),
            password: new FormControl(
                passConfig.keyConfig.keyword,
                this.passwordValidator.emptyPassword
            ),
            uri: new FormControl(passConfig.uri),
            notes: new FormControl(passConfig.notes)
        });
    }

    onInvalidName(form: FormGroup, formControlname: string): boolean {
        return this.getFormControl(form, formControlname).invalid &&
            this.getFormControl(form, formControlname).touched;
    }

    onNameRequired(form: FormGroup, formControlname: string): boolean {
        return this.onInvalidName(form, formControlname) &&
            this.getFormControl(form, formControlname).errors?.required;
    }

    onPasswordRequired(form: FormGroup, formControlname: string): boolean {
        return this.onInvalidName(form, formControlname) &&
            this.getFormControl(form, formControlname).errors?.emptyPassword;
    }

    onValidDateWarning(passConfig: PassConfig): string {
        let pColor: string = '';
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
                    pColor = 'warning';
                } else if (passConfig.security && daysBetweenDates <= 0) {
                    pColor = 'danger';
                }
            }
        }

        return pColor;
    }

    async onRegeneratePopover(secret: string, copy: boolean) {
        if (secret === undefined || secret === null) {
            const popover = await this.popoverController.create({
                component: RegeneratePopoverComponent,
                translucent: true,
                keyboardClose: false
            });
            popover.style.cssText = '--width: 78vw;';

            await popover.present();

            const { data } = await popover.onDidDismiss();
            if (data !== undefined && data.item.secret) {
                this.regenerate(data.item.secret, copy);
            }

            this.popoverController.dismiss();
        } else {
            this.togglePassword();
        }
    }
}
