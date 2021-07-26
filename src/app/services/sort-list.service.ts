import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SortListService {

    constructor() { }

    sort(list: any[], ascending: boolean): void {
        if (ascending) {
            this.sortAscending(list);
        } else {
            this.sortDescending(list);
        }
    }

    sortAscending(list: any[]): void {
        list.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase())
            ? 1
            : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    }

    sortDescending(list: any[]): void {
        list.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase())
            ? 1
            : ((b.name.toLowerCase() < a.name.toLowerCase()) ? -1 : 0));
    }
}
