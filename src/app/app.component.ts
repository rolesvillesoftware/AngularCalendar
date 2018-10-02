import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "MdrxCalendar";
  defaultsDate: Date;
  flyLeftDate: Date;
  noCalFocusDate: Date;
  defaultTodayInvalid: Date;
  presetTestDate: Date = new Date(2018, 3, 24); 
  stringTestDate: string;
}
