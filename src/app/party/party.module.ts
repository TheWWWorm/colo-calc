import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyComponent } from './party.component';
import { TileModule } from '../tile/tile.module';

@NgModule({
  imports: [
    CommonModule,
    TileModule
  ],
  declarations: [PartyComponent],
  exports: [PartyComponent]
})
export class PartyModule { }
