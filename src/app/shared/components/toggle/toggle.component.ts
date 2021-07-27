import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-toggle',
    templateUrl: './toggle.component.html'
})
export class ToggleComponent implements OnInit {

    @Input() control: AbstractControl;
    @Input() labelText: string;

    @Output() changeToggle: EventEmitter<any> = new EventEmitter<any>();

    form: FormGroup;

    constructor() { }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.form = new FormGroup({
            control: this.control
        });
    }

    onToggleChange() {
        this.changeToggle.emit();
    }
}
