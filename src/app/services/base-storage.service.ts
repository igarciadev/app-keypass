import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export abstract class BaseStorageService<T> {

    constructor() { }

    abstract load(): void;

    abstract findAll(): T[];

    abstract findById(id: number): T;

    abstract save(item: T): T[]

    abstract saveAll(items: T[]): T[]

    abstract update(item: T): T[];

    abstract delete(item: T): T[];
}
