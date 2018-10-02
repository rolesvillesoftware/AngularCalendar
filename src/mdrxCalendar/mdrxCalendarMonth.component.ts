import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";


@Component({
    selector: "app-calendar-month",
    template: `<div class="calMonth" [ngClass]="{'calMonthFlyUp': flyUp, 'calMonthFlyLeft': flyLeft, 'calMonthFlyBoth': flyBoth}">` +
        // tslint:disable:max-line-length
        `<div class="calMonthHeader">` +
        `<button type="button" (click)="today()" [title]="isCurrentMonth ? 'Set the selected date to today\\'s date' : 'Show calendar for current month'">Today</button>` +
        `<button type="button" (click)="previousMonth()" title="Show previous month's calendar" ><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><path d="M8.707 10.293l-5-5v1.414l5-5A1 1 0 0 0 7.293.293l-5 5a1 1 0 0 0 0 1.414l5 5a1 1 0 1 0 1.414-1.414z" fill="#464646"/></svg></button>` +
        `<button type="button" (click)="toggleShowMonths()" title="Select month to view in calendar">{{ month }}<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="#464646" fill-rule="nonzero" d="M10.293 3.293l-5 5h1.414l-5-5A1 1 0 0 0 .293 4.707l5 5a1 1 0 0 0 1.414 0l5-5a1 1 0 1 0-1.414-1.414z"/></svg></button>` +
        `<button type="button" (click)="nextMonth()" title="Show the next month's calendar"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="#464646" fill-rule="nonzero" d="M8.293 6.707V5.293l-5 5a1 1 0 0 0 1.414 1.414l5-5a1 1 0 0 0 0-1.414l-5-5a1 1 0 1 0-1.414 1.414l5 5z"/></svg></button>` +
        `<button type="button" (click)="toggleShowYears()" title="Select year to view in calendar">{{ year }}<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="#464646" fill-rule="nonzero" d="M10.293 3.293l-5 5h1.414l-5-5A1 1 0 0 0 .293 4.707l5 5a1 1 0 0 0 1.414 0l5-5a1 1 0 1 0-1.414-1.414z"/></svg></button>` +
        `<div class="calMonthDrop" *ngIf="showMonths"><ul><li *ngFor="let month of months; let i = index" [ngClass]="{'calMonthActive': activeMonth === i}" (click)="setMonth(i)">{{ month }}</li></ul></div>` +
        `<div class="calMonthDrop calYearDrop" *ngIf="showYears"><ul><li *ngFor="let year of years" [ngClass]="{'calMonthActive': activeYear === year}" (click)="setYear(year)">{{ year }}</li></ul></div>` +
        `</div>` +
        `<div class="calMonthBody" (wheel)="wheelMove($event)">` +
        `<app-calendar-week [headers]="days"></app-calendar-week>` +
        `<app-calendar-week *ngFor="let start of weeks" [firstDay]= "start" [month]="activeMonth" [activeDate]="date" [localeId]="localeId" (dateChange)="handleDateChange($event)"></app-calendar-week>` +
        `</div>` +
        `</div>`,
    styles: [
        ".calMonthHeader { padding: 7px 3.5px; background-color: #666; }",
        ".calMonthHeader > button { vertical-align: middle; margin-right: 3.5px; margin-left: 3.5px; font-size: 12px; color: #464646; text-align: center; height: 24px; border: 1px solid #666; background-image: linear-gradient(to bottom, #ffffff, #cccccc); }",
        ".calMonthHeader > button:focus { outline: -webkit-focus-ring-color none; }",
        ".calMonthHeader > button:first-child { width: 64px;}",
        ".calMonthHeader > button:nth-child(2) { width: 24px; margin-right: 0; padding: 0px; padding-bottom: 3px; }",
        ".calMonthHeader > button:nth-child(3) { margin: 0; width: 94px; }",
        ".calMonthHeader > button:nth-child(3) > svg { float: right; transform: translateY(2px); }",
        ".calMonthHeader > button:nth-child(4) { width: 24px; margin-left: 0;  padding: 0px; padding-bottom: 3px; }",
        ".calMonthHeader > button:nth-child(5) { width: 64px; }",
        ".calMonthHeader > button:nth-child(5) > svg { float: right; transform: translateY(2px); }",
        ".calMonthHeader > button > * { vertical-align: middle; }",
        ".calMonth { position: absolute; box-sizing: border-box; border: 1px solid #666; border-radius: 3px; margin-top: 4px; min-width: 302px; z-index: 999999999; }",
        ".calMonthBody { box-sizing: border-box; background-color: #fff; padding: 0px 10px 10px 10px; }",
        ".calMonthDrop { box-sizing: border-box; background: white; border: 1px solid black; position: absolute; left: 100px; width: 94px; max-height: 240px; overflow: auto; overflow-x: hidden; }",
        ".calMonthDrop > ul { list-style: none; padding: 0; margin: 0; text-align: center; font-size: 12px; color: #464646; }",
        ".calMonthDrop > ul > li { padding: 7px; box-shadow: inset 0 -1px 0 0 #e3e3e3; cursor: pointer; }",
        ".calMonthDrop > ul > li:hover { background-color: #eaf9fa; }",
        ".calMonthActive, .calMonthActive:hover  { background-color: #007d8a !important; color: white; font-weight: bold; }",
        ".calYearDrop { left: 200px; }",
        ".calMonthFlyUp { margin-top: -24px; transform: translateY(-100%); }",
        ".calMonthFlyLeft { transform: translateX(-69%); }",
        ".calMonthFlyBoth { transform: translate(-69%, -100%); }"
        // tslint:enable:max-line-length
    ]
})
export class MdrxCalendarMonthComponent implements OnInit {
    @Input() localeId = "en-US";
    @Input() minDate: Date = new Date(2017, 1, 1);
    @Input() maxDate: Date = new Date(2099, 12, 31);
    @Input() flyUp = false;
    @Input() flyLeft = false;
    @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();

    @Input()
    get date(): Date {
        return this._Date;
    }
    set date(v: Date) {
        this._Date = v == null ? null : new Date(v);
        this.setActive(this._Date);
    }
    activeMonth = new Date().getMonth();
    activeYear = new Date().getFullYear();
    showMonths = false;
    showYears = false;

    days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // tslint:disable-next-line:max-line-length
    public readonly months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    private emitData = false;
    private _Date: Date;

    get flyBoth(): boolean {
        return this.flyUp && this.flyLeft;
    }
    get isCurrentMonth(): boolean {
        const today = new Date();
        return this.activeMonth === today.getMonth() && this.activeYear === today.getFullYear();
    }
    get month(): string {
        return this.months[this.activeMonth];
    }

    get year(): string {
        return this.activeYear.toString();
    }

    get firstDate(): Date {
        const firstDay = new Date(this.activeYear, this.activeMonth, 1);
        firstDay.setDate(firstDay.getDate() - firstDay.getDay());

        return firstDay;
    }

    get weeks(): Date[] {
        const weeks: Date[] = [];
        const firstDate = this.firstDate;
        for (let i = 0; i < 7; i++) {
            const weekStartDate: Date = new Date(firstDate);
            weekStartDate.setDate(firstDate.getDate() + (i * 7));
            if (i > 0 && weekStartDate.getMonth() !== this.activeMonth) {
                break;
            } else {
                weeks.push(weekStartDate);
            }
        }
        return weeks;
    }

    get years(): number[] {
        const years: number[] = [];
        for (let year = this.minDate.getFullYear(); year <= this.maxDate.getFullYear(); year++) {
            years.push(year);
        }
        return years;
    }
    today(): void {
        const today = new Date();
        if (this.isCurrentMonth) {
            this.date = new Date();
        } else {
            this.setYear(today.getFullYear());
            this.setMonth(today.getMonth());
        }
    }
    previousMonth(): void {
        if (this.activeMonth === 0) {
            this.setMonth(11);
            this.setYear(this.activeYear - 1);
        } else {
            this.setMonth(this.activeMonth - 1);
        }
    }

    nextMonth(): void {
        if (this.activeMonth === 11) {
            this.setMonth(0);
            this.setYear(this.activeYear + 1);
        } else {
            this.setMonth(this.activeMonth + 1);
        }
    }
    toggleShowMonths(toggleValue: boolean = null): void {
        this.showMonths = toggleValue == null ? !this.showMonths : toggleValue;
        if (this.showMonths) {
            this.showYears = false;
        }
    }
    toggleShowYears(toggleValue: boolean = null): void {
        this.showYears = toggleValue == null ? !this.showYears : toggleValue;
        if (this.showYears) {
            this.showMonths = false;
        }
    }
    setMonth(month: number): void {
        if (month < 0) {
            this.activeMonth = 0;
        } else if (month > this.months.length - 1) {
            this.activeMonth = this.months.length - 1;
        } else {
            this.activeMonth = month;
        }
        setTimeout(() => { this.toggleShowMonths(false); }, 1);
    }
    setYear(year: number): void {
        if (year < (this.minDate || new Date()).getFullYear()) {
            this.activeYear = (this.minDate || new Date()).getFullYear();
        } else if (year > (this.maxDate || new Date()).getFullYear()) {
            this.activeYear = (this.maxDate || new Date()).getFullYear();
        } else {
            this.activeYear = year;
        }
        setTimeout(() => { this.toggleShowYears(false); }, 1);
    }
    handleDateChange(event: Date) {
        this.date = event;
    }
    wheelMove(event: WheelEvent) {
        if (this.showMonths || this.showYears) { return; }
        const movement = Math.trunc(event.deltaY / 4);
        if (movement < 0) {
            this.previousMonth(); 
        } else
            if (movement > 0) { this.nextMonth(); }
    }
    ngOnInit(): void {
        this.emitData = true;
    }

    private setActive(v: Date) {
        this.activeMonth = (this._Date || new Date()).getMonth();
        this.activeYear = (this._Date || new Date()).getFullYear();

        if (this.emitData) {
            this.dateChange.emit(v);
        }
    }

}
