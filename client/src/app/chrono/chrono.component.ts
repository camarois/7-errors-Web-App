import { Component } from '@angular/core';

@Component({
  selector: 'app-chrono',
  templateUrl: './chrono.component.html',
  styleUrls: ['./chrono.component.css']
})
export class ChronoComponent {
    time: number = 0;
    interval;
    running = false;

    public constructor() { }

    protected getSecondsSrtring(): string {
        if (this.time % 60 < 10) { return "0" + this.time % 60; } else { return this.time % 60 + ""; }
    }

    protected getMinutesString(): string {
        if (this.time / 60 < 10) { return "0" + Math.floor(this.time / 60); } else {return Math.floor(this.time / 60) + ""; }
    }

    protected reset(): void {
        this.time = 0;
        this.running = false;
        clearInterval(this.interval);
    }

    public stopTimer(): void {
        this.running = false;
        clearInterval(this.interval);
    }

    public getTime(): number {
        return this.time ;
    }

    public startTimer(): void {
        if (!this.running) {
            this.interval = setInterval(() => { this.time++; }, 1000);
            this.running = true;
        }
    }
}
