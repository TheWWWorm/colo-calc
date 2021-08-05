import { NgModule } from '@angular/core';
import { TranslatePipe } from '../language-service/translate.pipe';
import { ValidTileIdPipe } from './valid-tile-id.pipe';

@NgModule({
  declarations: [ValidTileIdPipe, TranslatePipe],
  exports: [ValidTileIdPipe, TranslatePipe],
})
export class PipesModule { }
