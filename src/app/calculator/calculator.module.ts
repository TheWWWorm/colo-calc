import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorComponent } from './calculator.component';
import { FieldModule } from '../field/field.module';
import { FormsModule } from '@angular/forms';
import { HeroSelectDialogModule } from '../hero-select-dialog/hero-select-dialog.module';
import { PartyModule } from '../party/party.module';

@NgModule({
  imports: [
    CommonModule,
    FieldModule,
    FormsModule,
    HeroSelectDialogModule,
    PartyModule
  ],
  declarations: [CalculatorComponent],
  exports: [CalculatorComponent]
})
export class CalculatorModule { }
