import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSelectDialogComponent } from './hero-select-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule
  ],
  declarations: [HeroSelectDialogComponent],
  exports: [HeroSelectDialogComponent],
  providers: [HeroSelectDialogComponent]
})
export class HeroSelectDialogModule { }
