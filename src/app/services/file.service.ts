import { Injectable } from '@angular/core';

import { AlertController } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';

import { StorageService } from './storage.service';
import { PassConfig } from '../models/pass-config.model';

import text from 'src/assets/text/file.service.text.json'

@Injectable({
    providedIn: 'root'
})
export class FileService {

    private blob: Blob;
    private promise: Promise<string>;
    private text: any;
    public returnPath: string;

    constructor(
        private alertController: AlertController,
        private file: File,
        public fileChooser: FileChooser,
        public filePath: FilePath,
        private storageService: StorageService
    ) {
        this.text = text;
        this.returnPath = '';
    }

    pickFile(): Promise<string> {
        return this.fileChooser.open();
    }

    createFile(fileName: string): Promise<FileEntry> {
        return this.file.createFile(this.file.externalDataDirectory, fileName, true);
    }

    writeFile(fileName: string, stringToWrite: string): Promise<any> {
        this.blob = new Blob([stringToWrite], { type: 'text/plain' });
        return this.file.writeFile(this.file.externalDataDirectory, fileName, this.blob, { replace: true, append: false });
    }

    exportToJsonFile(fileName: string): void {
        this.createFile(fileName)
            .then(() => {
                this.successFile(this.text.successExportText);
            }).catch(() => {
                this.errorCreatingFile();
            });

        const stringToWrite = JSON.stringify(this.storageService.getData(), null, 0);
        this.writeFile(fileName, stringToWrite);
    }

    importFormJsonFile(uriPath: string): Promise<void> {
        return this.readFile(uriPath);
    }

    async readFile(fileName: string) {
        const path = fileName.substring(0, fileName.lastIndexOf('/') + 1);
        const file = fileName.substring(fileName.lastIndexOf('/') + 1);

        this.promise = this.file.readAsText(path, file);
        await this.promise.then(value => {
            this.successFile(this.text.successImportText);
            const passConfigs = JSON.parse(value);
            passConfigs.forEach((passConfig: PassConfig) => {
                this.storageService.removePassConfig(passConfig);
            });
            this.storageService.saveData(passConfigs);
            this.storageService.loadData();
        }).catch(() => {
            this.errorReadingJson();
        });
    }

    async successFile(message: string) {
        const alert = await this.alertController.create({
            header: this.text.infoText,
            message: message,
            buttons: [this.text.acceptText]
        });

        await alert.present();
    }

    async errorCreatingFile() {
        const alert = await this.alertController.create({
            header: this.text.errorText,
            message: this.text.errorCreatingFileText,
            buttons: [this.text.acceptText]
        });

        await alert.present();
    }

    async errorReadingJson() {
        const alert = await this.alertController.create({
            header: this.text.errorText,
            message: this.text.errorReadingJsonText,
            buttons: [this.text.acceptText]
        });

        await alert.present();
    }
}
