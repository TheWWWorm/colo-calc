import { NgModule } from '@angular/core';
import { TranslatePipe } from '../language-service/translate.pipe';
import { SubMatrixPipe } from './sub-matrix.pipe';
import { ValidTileIdPipe } from './valid-tile-id.pipe';

@NgModule({
  declarations: [ValidTileIdPipe, TranslatePipe, SubMatrixPipe],
  exports: [ValidTileIdPipe, TranslatePipe, SubMatrixPipe],
})
export class PipesModule { }
