import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DatePipe } from "@angular/common";

@Component({
    selector: "app-calendar-week",
    // tslint:disable-next-line:max-line-length
    template: `<div [ngClass]="{'calWeekHeader': isHeader, 'calWeek': !isHeader}">` +
        `<app-calendar-day *ngFor="let day of days" [day]="day" [currentMonth]="isCurrentMonth(day)" [localeId]="localeId" (dateChange)="handleDateChange($event)" [selectedDate]="isActiveDate(day)">` +
        `</app-calendar-day></div>`,
    styles: [
        ".calWeekHeader { background-color: #e3e3e3; }",
        ".calWeek { border-bottom: 1px solid #e3e3e3; }"
    ]
})
export class MdrxCalendarWeekComponent {
    @Input() firstDay: Date = new Date();
    @Input() month: number;
    @Input() headers: string[] = undefined;;
    @Input() activeDate: Date; 
    @Input() localeId = "en-US";

    @Output() dateChange = new EventEmitter<Date>();

    get days(): (Date | string)[] {
        if (this.headers !== undefined) {
            return this.headers;
        } else {
            const days: Date[] = [];
            for (let i = 0; i < 7; i++) {
                const day = new Date(this.firstDay);
                day.setDate(this.firstDay.getDate() + i);
                days.push(day);
            }
            return days;
        }
    }
    get isHeader(): boolean {
        return this.headers != null && this.headers.length > 0;
    }
    isCurrentMonth(day: Date | string): boolean {

        return typeof day === "string" ||
            day.getMonth() === this.month;
    }
    isActiveDate(day: Date): boolean {
        if (this.activeDate == null) { return false; }

        const pipe = new DatePipe(this.localeId); 
        return pipe.transform(this.activeDate, "shortDate") === pipe.transform(day, "shortDate");
    }
    handleDateChange(event: Date) {
        this.dateChange.emit(event);
    }
}