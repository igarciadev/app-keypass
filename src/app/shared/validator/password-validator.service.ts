import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class PasswordValidatorService {

    constructor() { }

    emptyPassword(formControl: FormControl): { [s: string]: boolean } {
        const value = formControl.value;
        if (value === undefined || value === null || value === '') {
            return { emptyPassword: true };
        }

        return null;
    }
}
