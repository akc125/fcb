
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MonitorComponent } from './monitor/monitor.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { CategoryComponent } from './category/category.component'; 
import { ReactiveFormsModule } from '@angular/forms';
import { ExpenseComponent } from './expense/expense.component';

@NgModule({
  declarations: [
    AppComponent,
    MonitorComponent,
    HomeComponent,
    CategoryComponent,
    ExpenseComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
