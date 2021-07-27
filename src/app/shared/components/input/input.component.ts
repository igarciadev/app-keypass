import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import text from 'src/assets/text/input.component.text.json'

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {

    @Input() control: AbstractControl;
    @Input() labelText: string;
    @Input() required: any;
    @Input() minlength: any;
    @Input() disabled: boolean;
    @Input() enableCopyIcon: boolean;

    @Output() copyIconClick: EventEmitter<any> = new EventEmitter();

    form: FormGroup;
    inputClass: string;
    showPassword: boolean;
    requiredText: string;
    minlengthText: string;
    text: any;

    constructor() { }

    ngOnInit() {
        this.initForm();
        this.showPassword = false;
        this.text = text;
    }

    initForm() {
        this.form = new FormGroup({
            control: this.control
        });
    }

    onCopyIconClick() {
        this.copyIconClick.emit();
    }
}
