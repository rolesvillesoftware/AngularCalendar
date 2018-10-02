import { Component, ChangeDetectorRef, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { DatePipe } from "@angular/common";
import { EventManager } from "@angular/platform-browser";

@Component({
    selector: "app-mdrx-calendar",
    template: `<div class="calInput" [ngClass]="{'calInvalid': isInvalid }" [title]="isInvalid ? validateString || 'Invalid Date Entry' : 'Click to enter date'">` +
        `<input [placeholder]="placeHolder" ` +
        `[ngClass]='{"focused": isFocused}' ` +
        `[(ngModel)]="activeDate"  ` +
        `[ngModelOptions]="{updateOn: 'blur'}"  ` +
        `[readonly]="isReadOnly" ` +
        `(focus)="handleFocus($event)" ` +
        `(blur)="handleBlur($event) " ` +
        `(keypress)="keyPress($event)" ` +
        `#input />` +
        `<div class="showCalIcon" (click)="handleClick($event)">` +
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#007D8A" fill-rule="evenodd" d="M13 1V.5c0-.5.032-.5-.5-.5-.204 0-.503 0-.503.5V1H4V.5C3.99.02 4 0 3.5 0S3 0 3 .5V1H1.668A1.69 1.69 0 0 0 0 2.678v11.655C0 15.242.747 16 1.668 16h12.656A1.68 1.68 0 0 0 16 14.333V2.678A1.696 1.696 0 0 0 14.324 1H13zm1.333 14H1.667A.657.657 0 0 1 1 14.352V4.648C1 4.29 1.298 4 1.667 4h12.666c.368 0 .667.29.667.648v9.704a.658.658 0 0 1-.667.648zM2.56 11.807l2.885-2.79c.084-.084.171-.173.262-.268.091-.094.173-.194.247-.299.073-.105.134-.215.184-.33a.924.924 0 0 0 .073-.362.902.902 0 0 0-.325-.714 1.063 1.063 0 0 0-.341-.194 1.25 1.25 0 0 0-.415-.068c-.315 0-.573.091-.776.273a1.158 1.158 0 0 0-.367.734l-1.322-.105c.027-.342.11-.645.246-.907a2.04 2.04 0 0 1 .53-.656c.217-.174.468-.308.755-.398.287-.091.599-.137.934-.137.336 0 .649.044.94.131.29.088.543.217.76.389.217.17.388.39.514.655.126.266.189.577.189.934 0 .469-.107.872-.32 1.212-.214.34-.488.662-.824.97l-2.297 2.13h3.44v1.133H2.56v-1.333zm8.372-6.221c.315 0 .61.044.887.131.276.088.517.214.724.378.206.164.369.367.488.608.118.242.178.52.178.835 0 .398-.093.748-.278 1.049-.185.3-.467.507-.845.619v.02c.175.036.345.107.51.216a1.878 1.878 0 0 1 .734.939c.074.203.11.42.11.65 0 .37-.067.695-.2.97a2.081 2.081 0 0 1-.534.699c-.224.188-.49.33-.798.424a3.312 3.312 0 0 1-.976.142c-.35 0-.676-.047-.98-.142a2.248 2.248 0 0 1-.793-.424 2.082 2.082 0 0 1-.535-.698 2.215 2.215 0 0 1-.199-.97 1.896 1.896 0 0 1 .844-1.59c.165-.109.335-.18.51-.215v-.021c-.378-.112-.66-.319-.846-.62a1.96 1.96 0 0 1-.277-1.048c0-.315.059-.593.178-.835.119-.24.281-.444.488-.608.206-.164.447-.29.724-.378.276-.087.572-.131.886-.131zm0 4.123c-.168 0-.328.029-.482.084a1.156 1.156 0 0 0-.667.614 1.1 1.1 0 0 0-.1.467c0 .357.118.645.352.866.235.22.533.33.897.33s.663-.11.897-.33c.235-.221.352-.51.352-.866a1.1 1.1 0 0 0-.1-.467 1.162 1.162 0 0 0-.666-.614 1.411 1.411 0 0 0-.483-.084zm0-3.053c-.321 0-.572.098-.75.294a1.022 1.022 0 0 0-.268.713c0 .294.092.54.273.74.182.2.43.299.745.299.14 0 .271-.026.394-.079a1.024 1.024 0 0 0 .624-.96.979.979 0 0 0-.289-.713.98.98 0 0 0-.729-.294z"/></svg>` +
        `</div>` +
        `<div *ngIf="showCalendar" #calendar><app-calendar-month [flyUp]="flyUp" [flyLeft]="flyLeft" [(date)]="internalActiveDate" [localeId]="localeId" [minDate]="minDate" [maxDate]="maxDate"></app-calendar-month></div>` +
        `</div>`,
    styles: [
        ".showCalIcon { display: inline-block; text-align: right; }",
        ".showCalIcon > svg { transform: translateY(2px); }",
        ".calInput { color: #464646; border: solid 1px #007d8a; width: 102px; border-radius: 3px; background-color: #fff; padding: 2px; }",
        ".calInput > input { display: inline-block; font-size: 12px; border: none; width: 75%; transform: translateY(-2px); }",
        ".calInput > input:focus { outline: -webkit-focus-ring-color none; }",
        ".calInvalid { border-color: #cb0000; box-shadow: inset 0px 0px 3px 2px rgba(203,0,0,0.75); }"
    ]
})
export class MdrxCalendarComponent implements OnInit {
    @Input() displayFormat = "MM/dd/yyyy";
    @Input() localeId = "en-US";
    @Input() defaultTodayInvalid = false;
    @Input() returnFormat = null;
    @Input() placeHolder = this.displayFormat;
    @Input() required = false;
    @Input() minDate = new Date(2017, 0, 1);
    @Input() maxDate = new Date(new Date().getFullYear() + 10, 11, 31);
    @Input() calendarOnFocus = true;
    @Input() allowTextEntry = true;
    @Input() calendarCloseOnSelect = true;

    flyUp = false;
    flyLeft = false;
    isInvalid = false;

    private _preserveDate: Date;
    private _date: Date;
    @Input()
    get date(): Date {
        return this._date;
    }
    set date(v: Date) {
        const pipe = new DatePipe(this.localeId);
        let _tempDate: Date = null;
        if (v == null || (typeof v === "string" && (v as string).length === 0)) {
            _tempDate = null;
        } else {
            _tempDate = isNaN(v as any) ? null : new Date(pipe.transform(v, "shortDate"));
        }
        if (_tempDate != null && pipe.transform(_tempDate, "shortDate") === pipe.transform(this._date, "shortDate")) {
            return;
        }
        this._date = _tempDate;
        if (!this.emitOutput) { return; }
        if (this.returnFormat) {
            if (!this.isInvalid || this.defaultTodayInvalid) {
                this.dateValueChange.emit(pipe.transform(this._date, this.returnFormat));
            } else {
                this.dateValueChange.emit(this.validateString);
            }
        }
        if (!this.isInvalid || this.defaultTodayInvalid) {
            this.dateChange.emit(this._date);
            this._preserveDate = this._date;
        }

        if (this.calendarCloseOnSelect) {
            this.toggleShowCalendar(false);
        }
    }

    @Output() validationError = new EventEmitter<string>();
    @Output() dateChange = new EventEmitter<Date>();
    @Output() dateValueChange = new EventEmitter<string>();

    @ViewChild("input") inputControl: ElementRef;
    @ViewChild("calendar") calendarDrop: ElementRef;

    showCalendar = false;
    focused = false;

    get isReadOnly(): boolean {
        return this.showCalendar || !this.allowTextEntry;
    }

    get isFocused(): boolean {
        return this.focused || this.showCalendar;
    }

    private emitOutput = false;
    private validateString = "";

    get activeDate(): string {
        if (this._date == null) { return ""; }

        if (!(this.date instanceof Date) || isNaN(this.date as any)) { return "Invalid Date"; }
        return new DatePipe(this.localeId).transform(this.date, this.displayFormat);
    }
    set activeDate(v: string) {
        this.date = this.validateDate(v);
        if (this.isInvalid) {
            let dt = null;
            if (this.defaultTodayInvalid) {
                this.validateString += " - Defaulting to today's date";
            }

            setTimeout(() => {
                this.date = new Date(new DatePipe(this.localeId).transform(new Date(), "shortDate"));
                if (!this.defaultTodayInvalid) {
                    setTimeout(() => { this.date = this._preserveDate; }, 1);
                }
            }, 1);
        }
    }

    get internalActiveDate(): Date {
        return this._date;
    }
    set internalActiveDate(v: Date) {
        if (v == null || isNaN(v as any)) {
            this.activeDate = null;
        } else {
            this.activeDate = new DatePipe(this.localeId).transform(v, "shortDate");
        }
    }
    constructor(private elementRef: ElementRef, private changeDectorRef: ChangeDetectorRef) { }

    handleFocus(event: Event): void {
        this.focused = true;
        if (this.calendarOnFocus || !this.allowTextEntry) {
            this.toggleShowCalendar(!this.showCalendar);
            this.inputControl.nativeElement.blur();
        } else {
            this.inputControl.nativeElement.select();
        }
    }
    handleBlur(event: Event): void {
        this.focused = false;
    }
    handleClick(event: Event): void {
        this.toggleShowCalendar(!this.showCalendar);
    }
    keyPress(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            (this.inputControl.nativeElement as HTMLInputElement).blur();
        }
    }
    ngOnInit(): void {
        this._preserveDate = this._date;
        this.emitOutput = true;
    }
    private toggleShowCalendar(toggleVal: boolean): void {
        this.showCalendar = toggleVal;

        if (this.showCalendar) {
            this.testPosition();
            this.setEvents();
        } else {
            this.killEvents();
        }
    }
    private killEvents(): void {
        document.removeEventListener('click', this.outSideClick);
    }
    private setEvents(): void {
        document.addEventListener('click', this.outSideClick);
    }
    private outSideClick = (event: MouseEvent): void => {
        if (this.isInControl(event.target)) { return; }
        this.toggleShowCalendar(false);
    };
    private isInControl(element: any): boolean {
        if (element == this.elementRef.nativeElement) {
            return true;
        } else {
            const parent = element.parentElement;
            if (parent == null) {
                return false;
            } else {
                return this.isInControl(parent);
            }
        }
    }
    private testPosition(): void {
        const inputLocation = this.inputControl.nativeElement.getBoundingClientRect();
        const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

        this.flyUp = (inputLocation.bottom + 320) > screenHeight;
        this.flyLeft = (inputLocation.left + 310) > screenWidth;
    }

    private validateDate(v: Date | string): Date {
        this.isInvalid = false;
        this.validateString = null;

        if (v === undefined || (typeof (v) === "string" && v.length === 0)) { return; }

        let date = new Date(v);
        this.validateString = this.validationRules(date, typeof v === "string" ? v : null) || "";
        if (this.validateString.length > 0) {
            this.isInvalid = true;
            if (this.emitOutput) { this.validationError.emit(this.validateString); }
            date = null;
        } else {
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
        return date;
    }
    private validationRules(date: Date, dateString: string): string {
        if (!(date instanceof Date)) { return "Not a proper date value"; }
        if (isNaN(date as any)) {
            if (dateString != null && dateString.length > 0) {
                return `${dateString} is not a proper date value or a recognized date format.`;
            } else {
                return `Not a proper date value`;
            }
        }

        const pipe = new DatePipe(this.localeId);

        if (date < this.minDate) { return `${pipe.transform(date, "shortDate")} is prior to minimum date of ${pipe.transform(this.minDate, "shortDate")}`; }
        if (date > this.maxDate) { return `${pipe.transform(date, "shortDate")} is after the maximum date of ${pipe.transform(this.maxDate, "shortDate")}`; }

        return;
    }
}