import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class ValidatorService {

    constructor() { }

    emptyPassword(formControl: FormControl): { [s: string]: boolean } {
        const value = formControl.value;
        if (value === undefined || value === null || value === '') {
            return { emptyPassword: true };
        }

        return null;
    }

    wrongName(formControl: FormControl): { [s: string]: boolean } {
        const value = formControl.value;
        const regex = /^[A-Za-z0-9 ]+$/;
        if (value !== undefined && value !== '' && !regex.test(value)) {
            return { wrongName: true };
        }

        return null;
    }
}
