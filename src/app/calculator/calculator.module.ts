import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorComponent } from './calculator.component';
import { FieldModule } from '../field/field.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeroSelectDialogModule } from '../hero-select-dialog/hero-select-dialog.module';
import { PartyModule } from '../party/party.module';
import { PipesModule } from '../pipes/pipes.module';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  imports: [
    CommonModule,
    FieldModule,
    FormsModule,
    HeroSelectDialogModule,
    PartyModule,
    PipesModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule
  ],
  declarations: [CalculatorComponent],
  exports: [CalculatorComponent]
})
export class CalculatorModule { }
