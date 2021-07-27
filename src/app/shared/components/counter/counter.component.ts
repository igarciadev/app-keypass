import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.scss']
})
export class CounterComponent {

    @Input() control: AbstractControl;
    @Input() labelText: string;
    @Input() disableItem: boolean;
    @Input() disableDecrement: boolean;
    @Input() disableIncrement: boolean;

    @Output() decrementButtonClick: EventEmitter<any> = new EventEmitter();
    @Output() incrementButtonClick: EventEmitter<any> = new EventEmitter();

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

    onDecrementButtonClick() {
        this.decrementButtonClick.emit();
    }

    onIncrementButtonClick() {
        this.incrementButtonClick.emit();
    }
}
