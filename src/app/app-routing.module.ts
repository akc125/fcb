import { ExpenseDetailsComponent } from './expense-details/expense-details.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivateFn } from '@angular/router';
import { MonitorComponent } from './monitor/monitor.component';
import { CategoryComponent } from './category/category.component';
import { ExpenseComponent } from './expense/expense.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth.guard';


const routes: Routes = [
  { path: 'home', component: HomeComponent,
  canActivate:[authGuard]},
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'categories',
    component: CategoryComponent, canActivate:[authGuard]
  },
  {
    path: 'monitor',
    component: MonitorComponent, canActivate:[authGuard]
  },
  {
    path: 'categories/:id',
    component: ExpenseComponent, canActivate:[authGuard]
  },
  {
    path: 'categories/:id/expenseDetails/:id',
    component: ExpenseDetailsComponent, canActivate:[authGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
