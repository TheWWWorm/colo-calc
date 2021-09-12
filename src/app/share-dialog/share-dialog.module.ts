import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareDialogComponent } from './share-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    PipesModule,
  ],
  declarations: [ShareDialogComponent],
  exports: [ShareDialogComponent],
  providers: [ShareDialogComponent],
})
export class ShareDialogModule { }
