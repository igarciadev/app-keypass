import { Injectable } from '@angular/core';

import { File, FileEntry } from '@ionic-native/file/ngx';

import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    private blob: Blob;
    private directory: string;
    private promise: Promise<string>;

    constructor(
        private file: File,
        private storageService: StorageService
    ) {
        this.directory = this.file.applicationStorageDirectory;
    }

    createFile(fileName: string): Promise<FileEntry> {
        return this.file.createFile(this.directory, fileName, true);
    }

    async readFile(fileName: string) {
        this.promise = this.file.readAsText(this.directory, fileName);
        await this.promise.then(value => {
            this.storageService.saveData(JSON.parse(value));
        });
    }

    writeFile(fileName: string, stringToWrite: string): Promise<any> {
        this.blob = new Blob([stringToWrite], { type: 'text/plain' });
        return this.file.writeFile(this.file.dataDirectory, fileName, this.blob, { replace: true, append: false });
    }
}
