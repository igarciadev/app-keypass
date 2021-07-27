import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import text from 'src/assets/text/password.component.text.json'

@Component({
    selector: 'app-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

    @Input() control: AbstractControl;
    @Input() labelText: string;
    @Input() required: any;
    @Input() minlength: any;
    @Input() disabled: boolean;
    @Input() enableSettingsIcon: boolean;
    @Input() enableCopyIcon: boolean;

    @Output() settingsIconClick: EventEmitter<any> = new EventEmitter();
    @Output() copyIconClick: EventEmitter<any> = new EventEmitter();

    form: FormGroup;
    type: string;
    itemClass: string;
    inputClass: string;
    eyeIconName: string;
    showPassword: boolean;
    requiredText: string;
    minlengthText: string;
    text: any;

    constructor() {
        this.disabled = false;
        this.enableSettingsIcon = false;
        this.enableCopyIcon = false;
    }

    ngOnInit() {
        this.initForm();
        this.type = 'password';
        this.inputClass = 'field-input';
        this.eyeIconName = 'eye-off-outline';
        this.showPassword = false;
        this.text = text;
    }

    initForm() {
        this.form = new FormGroup({
            control: this.control
        });
    }

    toggleIcons() {
        this.showPassword = !this.showPassword;
        this.eyeIconName = this.showPassword ? 'eye-outline' : 'eye-off-outline';
        this.type = this.showPassword ? 'text' : 'password';
        this.inputClass = !this.showPassword ? 'field-input' : '';
    }

    onSettingsIconClick() {
        this.settingsIconClick.emit();
    }

    onCopyIconClick() {
        this.copyIconClick.emit();
    }
}
