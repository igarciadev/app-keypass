import { Injectable } from '@angular/core';

import { File, FileEntry } from '@ionic-native/file/ngx';
import { AlertController } from '@ionic/angular';
import { PassConfigFavoriteService } from './pass-config-favorite.service';
import { PassConfigListService } from './pass-config-list.service';

import { StorageService } from './storage.service';
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
        private passConfigListService: PassConfigListService,
        private passConfigFavoriteService: PassConfigFavoriteService,
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
            this.storageService.saveData(JSON.parse(value));
        });
    }

    writeFile(fileName: string, stringToWrite: string): Promise<any> {
        this.blob = new Blob([stringToWrite], { type: 'text/plain' });
        return this.file.writeFile(this.file.dataDirectory, fileName, this.blob, { replace: true, append: false });
    }

    exportToJsonFile(): void {
        this.createFile('data').then(value => {
            this.successCreatingFile();
        }).catch(() => {
            this.errorCreatingFile();
        });

        this.writeFile('data', JSON.stringify(this.storageService.getData()));
    }

    importFormJsonFile(): void {
        this.readFile('data').then(value => {
            this.successReadingFile();
            this.passConfigListService.init();
            this.passConfigFavoriteService.init();
        }).catch(() => {
            this.errorReadingJson();
        });
    }

    async successCreatingFile() {
        const alert = await this.alertController.create({
            header: 'Información',
            message: 'Configuraciones de contraseñas exportadas con éxito',
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

    async successReadingFile() {
        const alert = await this.alertController.create({
            header: 'Información',
            message: 'Configuraciones de contraseñas importadas con éxito',
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
