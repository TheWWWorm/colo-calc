import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { PipesModule } from '../pipes/pipes.module';
import { CreditsDialogComponent } from './credits-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    PipesModule,
  ],
  declarations: [CreditsDialogComponent],
  exports: [CreditsDialogComponent],
  providers: [CreditsDialogComponent],
})
export class CreditsDialogModule { }
