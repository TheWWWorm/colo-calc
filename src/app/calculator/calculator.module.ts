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
import { MatIconModule } from '@angular/material/icon';
import { ShareDialogModule } from '../share-dialog/share-dialog.module';
import { HelpDialogModule } from '../help-dialog/help-dialog.module';
import { AttackOrderModule } from '../attack-order/attack-order.module';
import { CreditsDialogModule } from '../credits-dialog/credits-dialog.module';
import { TeamSelectDialogModule } from '../team-select-dialog/team-select-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    FieldModule,
    FormsModule,
    HeroSelectDialogModule,
    ShareDialogModule,
    TeamSelectDialogModule,
    HelpDialogModule,
    CreditsDialogModule,
    PartyModule,
    PipesModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    AttackOrderModule,
  ],
  declarations: [CalculatorComponent],
  exports: [CalculatorComponent]
})
export class CalculatorModule { }
