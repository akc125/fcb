import { DebitComponent } from "./debit/debit.component";
import { ExpenseDetailsComponent } from "./expense-details/expense-details.component";
import { HomeComponent } from "./home/home.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes, CanActivateFn } from "@angular/router";
import { MonitorComponent } from "./monitor/monitor.component";
import { CategoryComponent } from "./category/category.component";
import { ExpenseComponent } from "./expense/expense.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { authGuard } from "./auth.guard";
import { AboutComponent } from "./about/about.component";
import { CreaditComponent } from "./creadit/creadit.component";
import { NotificationComponent } from "./notification/notification.component";
import { ActionComponent } from "./action/action.component";
import { CommissionComponent } from "./commission/commission.component";
import { CommissionDetailsComponent } from "./commission-details/commission-details.component";
import { TradComponent } from "./trad/trad.component";
import { Trad2Component } from "./trad2/trad2.component";
import { Trad3Component } from "./trad3/trad3.component";

const routes: Routes = [
  { path: "home", component: HomeComponent, canActivate: [authGuard] },
  { path: "", component: LoginComponent },
  { path: "login", component: LoginComponent },
  {
    path: "notification",
    component: NotificationComponent,
    canActivate: [authGuard],
  },
  {
    path: "commission",
    component: CommissionComponent,
    canActivate: [authGuard],
  },
  {
    path: "trad",
    component: TradComponent,
    canActivate: [authGuard],
  },
  {
    path: "trad/:id",
    component: Trad2Component,
    canActivate: [authGuard],
  },
  {
    path: "trad3",
    component: Trad3Component,
    canActivate: [authGuard],
  },
  {
    path: "action/:id",
    component: ActionComponent,
    canActivate: [authGuard],
  },
  { path: "register", component: RegisterComponent },
  { path: "about", component: AboutComponent, canActivate: [authGuard] },
  {
    path: "commissionDetails/:id",
    component: CommissionDetailsComponent,
    canActivate: [authGuard],
  },
  { path: "debit", component: DebitComponent, canActivate: [authGuard] },
  { path: "creadit", component: CreaditComponent, canActivate: [authGuard] },
  {
    path: "categories",
    component: CategoryComponent,
    canActivate: [authGuard],
  },
  {
    path: "monitor",
    component: MonitorComponent,
    canActivate: [authGuard],
  },
  {
    path: "categories/:id",
    component: ExpenseComponent,
    canActivate: [authGuard],
  },
  {
    path: "categories/:id/expenseDetails/:id",
    component: ExpenseDetailsComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
