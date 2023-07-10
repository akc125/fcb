import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonitorComponent } from './monitor/monitor.component';
import { CategoryComponent } from './category/category.component';
import { ExpenseComponent } from './expense/expense.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'categories',
    component: CategoryComponent,
  },
  {
    path: 'monitor',
    component: MonitorComponent,
  },{
    path: 'categories/:id',
    component: ExpenseComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
