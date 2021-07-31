import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorComponent } from './calculator.component';
import { FieldModule } from '../field/field.module';
import { AiToggleModule } from 'src/ai-toggle/ai-toggle.module';

@NgModule({
  imports: [
    CommonModule,
    FieldModule,
    AiToggleModule
  ],
  declarations: [CalculatorComponent],
  exports: [CalculatorComponent]
})
export class CalculatorModule { }
