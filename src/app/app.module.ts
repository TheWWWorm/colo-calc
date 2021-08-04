import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalculatorModule } from './calculator/calculator.module';

@NgModule({
  declarations: [		
    AppComponent,
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CalculatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
