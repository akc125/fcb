import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MonitorComponent } from "./monitor/monitor.component";
import { HomeComponent } from "./home/home.component";
import { HttpClientModule } from "@angular/common/http";
import { CategoryComponent } from "./category/category.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ExpenseComponent } from "./expense/expense.component";
import { ExpenseDetailsComponent } from "./expense-details/expense-details.component";
import { LineGraphComponent } from "./line-graph/line-graph.component";
import { NgChartsModule } from "ng2-charts";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { AboutComponent } from "./about/about.component";
import { CanvasJSAngularChartsModule } from "@canvasjs/angular-charts";
import { MatBadgeModule } from "@angular/material/badge";
import { MatIconModule } from "@angular/material/icon";
import { HeaderComponent } from "./header/header.component";
import { CreaditComponent } from "./creadit/creadit.component";
import { NotificationComponent } from "./notification/notification.component";
import { ActionComponent } from "./action/action.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommissionComponent } from "./commission/commission.component";
import { NgImageSliderModule } from "ng-image-slider";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommissionDetailsComponent } from "./commission-details/commission-details.component";
import { DebitComponent } from "./debit/debit.component";
import { TradComponent } from "./trad/trad.component";
import { Trad2Component } from "./trad2/trad2.component";
import { Trad3Component } from "./trad3/trad3.component";
import { MatRadioModule } from "@angular/material/radio";
import { RulesComponent } from "./trad2/rules/rules.component";

@NgModule({
  declarations: [
    AppComponent,
    MonitorComponent,
    HomeComponent,
    CategoryComponent,
    ExpenseComponent,
    ExpenseDetailsComponent,
    LineGraphComponent,
    LoginComponent,
    RegisterComponent,
    AboutComponent,
    HeaderComponent,
    CreaditComponent,
    NotificationComponent,
    ActionComponent,
    CommissionComponent,
    CommissionDetailsComponent,
    DebitComponent,
    TradComponent,
    Trad2Component,
    Trad3Component,
    RulesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgChartsModule,
    CanvasJSAngularChartsModule,
    MatBadgeModule,
    MatIconModule,
    MatIconModule,
    MatTooltipModule,
    NgImageSliderModule,
    BrowserAnimationsModule,
    MatRadioModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
