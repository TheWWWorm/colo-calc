import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { PipesModule } from '../pipes/pipes.module';
import { TeamSelectDialogComponent } from './team-select-dialog.component';
import { FieldModule } from '../field/field.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    PipesModule,
    FieldModule,
    MatIconModule
  ],
  declarations: [TeamSelectDialogComponent],
  exports: [TeamSelectDialogComponent],
  providers: [TeamSelectDialogComponent],
})
export class TeamSelectDialogModule { }
