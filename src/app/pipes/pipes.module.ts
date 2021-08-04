import { NgModule } from '@angular/core';
import { ValidTileIdPipe } from './valid-tile-id.pipe';

@NgModule({
  declarations: [ValidTileIdPipe],
  exports: [ValidTileIdPipe],
})
export class PipesModule { }
