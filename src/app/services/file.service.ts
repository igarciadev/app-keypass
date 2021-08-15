import { Injectable } from '@angular/core';

import { File, FileEntry } from '@ionic-native/file/ngx';
import { AlertController } from '@ionic/angular';

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

    constructor(
        private alertController: AlertController,
        private file: File,
        private storageService: StorageService
    ) {
        this.text = text;
    }

    createFile(fileName: string): Promise<FileEntry> {
        return this.file.createFile(this.file.dataDirectory, fileName, true);
    }

    async readFile(fileName: string) {
        this.promise = this.file.readAsText(this.file.dataDirectory, fileName);
        await this.promise.then(value => {
            const passConfigs = JSON.parse(value);

            passConfigs.forEach((passConfig: PassConfig) => {
                this.storageService.removePassConfig(passConfig);
            })

            this.storageService.saveData(passConfigs);
            this.storageService.loadData();
        });
    }

    writeFile(fileName: string, stringToWrite: string): Promise<any> {
        this.blob = new Blob([stringToWrite], { type: 'text/plain' });
        return this.file.writeFile(this.file.dataDirectory, fileName, this.blob, { replace: true, append: false });
    }

    exportToJsonFile(): void {
        this.createFile('data')
            .then(() => {
                this.successFile(this.text.successExportText);
            }).catch(() => {
                this.errorCreatingFile();
            });

        const stringToWrite = JSON.stringify(this.storageService.getData(), null, 0);
        this.writeFile('data', stringToWrite);
    }

    importFormJsonFile(): Promise<void> {
        return this.readFile('data')
            .then(() => {
                this.successFile(this.text.successImportText);
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
