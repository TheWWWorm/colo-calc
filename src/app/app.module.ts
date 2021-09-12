import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalculatorModule } from './calculator/calculator.module';
import { routes } from './routing';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [		
    AppComponent,
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    CalculatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
