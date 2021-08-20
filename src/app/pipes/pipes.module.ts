import { NgModule } from '@angular/core';
import { TranslatePipe } from '../language-service/translate.pipe';
import { GetBgClassPipe } from './get-bg-class.pipe';
import { SubMatrixPipe } from './sub-matrix.pipe';
import { ValidTileIdPipe } from './valid-tile-id.pipe';

@NgModule({
  declarations: [ValidTileIdPipe, TranslatePipe, SubMatrixPipe, GetBgClassPipe],
  exports: [ValidTileIdPipe, TranslatePipe, SubMatrixPipe, GetBgClassPipe],
})
export class PipesModule { }
