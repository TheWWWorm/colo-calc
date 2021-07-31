import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TileComponent } from './tile.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TileComponent],
  exports: [TileComponent]
})
export class TileModule { }
