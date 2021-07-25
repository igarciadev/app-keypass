import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-toggle',
    templateUrl: './toggle.component.html'
})
export class ToggleComponent implements OnInit {

    @Input() control: FormControl;
    @Input() text: string;

    @Output() changeToggle: EventEmitter<any> = new EventEmitter<any>();

    constructor() { }

    ngOnInit() { }

    onToggleChange() {
        this.changeToggle.emit();
    }
}
