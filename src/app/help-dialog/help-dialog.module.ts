import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { PipesModule } from '../pipes/pipes.module';
import { HelpDialogComponent } from './help-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    PipesModule,
  ],
  declarations: [HelpDialogComponent],
  exports: [HelpDialogComponent],
  providers: [HelpDialogComponent],
})
export class HelpDialogModule { }
