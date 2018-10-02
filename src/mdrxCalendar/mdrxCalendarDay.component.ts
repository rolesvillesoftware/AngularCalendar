import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DatePipe } from "@angular/common"; 

@Component({
    selector: "app-calendar-day",
    // tslint:disable-next-line:max-line-length
    template: `<div class="calDay" ` +
        `[ngClass]="{'calDayActiveMonth': currentMonth, 'isDate': isDate, 'calDayWeekend': isWeekend, 'calDayToday': isCurrentDate, 'calDaySelected': selectedDate}" `+
        `(click)="dateSelected()" >{{ dayString }}<div>`,
    styles: [
        // tslint:disable-next-line:max-line-length
        ".calDay { box-sizing: border-box; display: inline-block; text-align: center; width: 40px; height: 20px; font-size: 12px; }",
        ".isDate { height: 40px; font-size: 16px; color: #999; cursor: pointer; padding: 9px 0px; }",
        ".calDayActiveMonth { color: #464646; font-weight: bold; }",
        ".isDate:hover { background-color: #eaf9fa; }",
        ".calDaySelected, .calDaySelected:hover { background-color: #007d8a !important; color: white !important; }",
        ".calDayWeekend { background-color: #f2f2f2; }",
        ".calDayToday { color: #007d8a; background: white; border: 1px solid #007d8a; }"
    ]
})
export class MdrxCalendarDayComponent {
    @Input() day: Date | string;
    @Input() currentMonth = false;
    @Input() selectedDate = false;
    @Input() localeId = "en-US";

    @Output() dateChange = new EventEmitter<Date>();

    get isWeekend(): boolean { 
        if (this.day == null) { return false; }
        if (typeof this.day === "string") { return false; }
        return [0, 6].some(item => item == (this.day as Date).getDay()); 
    }
    get isDate(): boolean {
        return this.day instanceof Date;
    }
    get isCurrentDate(): boolean {
        if (this.day == null) { return false; }
        if (typeof this.day === "string") { return false; }
        
        const pipe = new DatePipe(this.localeId); 
        return pipe.transform(this.day, "shortDate") === pipe.transform(new Date(), "shortDate");
    }
    get dayString(): string {
        return typeof this.day === "string" ? this.day : this.day.getDate().toString();
    }

    dateSelected(): void {
        if (this.day instanceof Date) {
            this.dateChange.emit(this.day);
        }
    }

}
