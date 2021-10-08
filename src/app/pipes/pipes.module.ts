import { NgModule } from '@angular/core';
import { TranslatePipe } from '../language-service/translate.pipe';
import { CharacterToTilePipe } from './character-to-tile.pipe';
import { FilterCharactersPipe } from './filter-characters.pipe';
import { GetBgClassPipe } from './get-bg-class.pipe';
import { GetStatusPathPipe } from './get-status-path.pipe';
import { SubMatrixPipe } from './sub-matrix.pipe';
import { ValidTileIdPipe } from './valid-tile-id.pipe';

const pipes = [ValidTileIdPipe, TranslatePipe, SubMatrixPipe, GetBgClassPipe, CharacterToTilePipe, FilterCharactersPipe, GetStatusPathPipe];

@NgModule({
  declarations: pipes,
  exports: pipes,
})
export class PipesModule { }
