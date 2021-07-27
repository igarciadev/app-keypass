import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-textarea',
    templateUrl: './textarea.component.html',
    styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit, OnChanges {

    @Input() text: string;
    @Input() labelText: string;
    @Input() disabled: boolean;
    @Input() enableCopyIcon: boolean;

    @Output() copyIconClick: EventEmitter<any> = new EventEmitter();

    class: string;

    constructor(private elementRef: ElementRef) { }

    ngOnInit() {
        this.class = 'textarea';
    }

    ngOnChanges() {
        let element = this.elementRef.nativeElement.getElementsByTagName('textarea')[0];
        if (element !== undefined) {
            let height = Number(element.style.height.replace('px', ''));
            this.class = height <= 37 ? 'textarea' : '';
        }
    }

    onCopyIconClick() {
        this.copyIconClick.emit();
    }
}
