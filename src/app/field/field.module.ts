import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldComponent } from './field.component';
import { TileModule } from '../tile/tile.module';

@NgModule({
  imports: [
    CommonModule,
    TileModule
  ],
  declarations: [FieldComponent],
  exports: [FieldComponent]
})
export class FieldModule { }
