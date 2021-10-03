export class TimeCore {

    date: Date;
    day: string;
    month: string;
    year: string;
    hour: string;
    minute: string;
    second: string;

    getNow(date?: Date): void {

        if (date === undefined) {
            this.date = new Date();
        } else {
            this.date = date;
        }

        this.day = (this.date.getDate() < 10 ? '0' : '') + this.date.getDate();
        this.month = (this.date.getMonth() + 1 < 10 ? '0' : '') + (this.date.getMonth() + 1);
        this.year = String(this.date.getFullYear());
        this.hour = (this.date.getHours() < 10 ? '0' : '') + this.date.getHours();
        this.minute = (this.date.getMinutes() < 10 ? '0' : '') + this.date.getMinutes();
        this.second = (this.date.getSeconds() < 10 ? '0' : '') + this.date.getSeconds();
    }

    forModel(date?: Date): string {
        this.getNow(date);
        return `${this.day}/${this.month}/${this.year} ${this.hour}:${this.minute}:${this.second}`;
    }

    forFile(): string {
        this.getNow();
        return `${this.year}${this.month}${this.day}${this.hour}${this.minute}${this.second}`;
    }
}
