import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UrlService {

    private currentUrl: BehaviorSubject<string>;
    private previousUrl: BehaviorSubject<string>;

    public currentUrl$: Observable<string>;
    public previousUrl$: Observable<string>;

    constructor() {
        this.currentUrl = new BehaviorSubject<string>(null);
        this.previousUrl = new BehaviorSubject<string>(null);

        this.currentUrl$ = this.currentUrl.asObservable();
        this.previousUrl$ = this.previousUrl.asObservable();
    }

    setCurrentUrl(currentUrl: string) {
        this.currentUrl.next(currentUrl);
    }

    setPreviousUrl(previousUrl: string) {
        this.previousUrl.next(previousUrl);
    }
}
