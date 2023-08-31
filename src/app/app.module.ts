
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
import { ExpenseDetailsComponent } from './expense-details/expense-details.component';
import { LineGraphComponent } from './line-graph/line-graph.component';
import { NgChartsModule } from 'ng2-charts';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AboutComponent } from './about/about.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

  
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgChartsModule,
    CanvasJSAngularChartsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
