import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-textarea',
    templateUrl: './textarea.component.html',
    styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit, OnChanges {

    @Input() text: string;
    @Input() labelText: string;
    @Input() disabled: boolean;
    @Input() showCopyButton: boolean;

    @Output() copyIconClick: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    ngOnChanges() { }

    onCopyIconClick() {
        this.copyIconClick.emit();
    }
}
