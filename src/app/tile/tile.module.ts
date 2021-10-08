import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TileComponent } from './tile.component';
import { PipesModule } from '../pipes/pipes.module';
import { RichTooltipModule } from '../rich-tooltip/rich-tooltip.module';

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    RichTooltipModule
  ],
  declarations: [TileComponent],
  exports: [TileComponent]
})
export class TileModule { }
