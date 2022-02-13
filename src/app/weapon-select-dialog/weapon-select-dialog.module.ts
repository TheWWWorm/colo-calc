import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeaponSelectDialogComponent } from './weapon-select-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { PipesModule } from '../pipes/pipes.module';
import { TileModule } from '../tile/tile.module';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    PipesModule,
    TileModule
  ],
  declarations: [WeaponSelectDialogComponent],
  exports: [WeaponSelectDialogComponent],
  providers: [WeaponSelectDialogComponent]
})
export class WeaponSelectDialogModule { }
