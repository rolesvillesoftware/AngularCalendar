import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MdrxCalendarComponent } from "./mdrxCalendar.component";
import { MdrxCalendarMonthComponent } from "./mdrxCalendarMonth.component";
import { MdrxCalendarWeekComponent } from "./mdrxCalendarWeek.component";
import { MdrxCalendarDayComponent } from "./mdrxCalendarDay.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        MdrxCalendarComponent,
        MdrxCalendarMonthComponent,
        MdrxCalendarWeekComponent,
        MdrxCalendarDayComponent
    ],
    exports: [
        MdrxCalendarComponent
    ]
})
export class MdrxCalendarModule {

}