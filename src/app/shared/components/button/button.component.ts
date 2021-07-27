import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html'
})
export class ButtonComponent implements OnInit {

    @Input() text: string;
    @Input() disabled: boolean;

    @Output() buttonClick: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    onButtonClick() {
        this.buttonClick.emit();
    }
}
