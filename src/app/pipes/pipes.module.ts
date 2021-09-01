import { NgModule } from '@angular/core';
import { TranslatePipe } from '../language-service/translate.pipe';
import { CharacterToTilePipe } from './character-to-tile.pipe';
import { FilterCharactersPipe } from './filter-characters.pipe';
import { GetBgClassPipe } from './get-bg-class.pipe';
import { SubMatrixPipe } from './sub-matrix.pipe';
import { ValidTileIdPipe } from './valid-tile-id.pipe';

@NgModule({
  declarations: [ValidTileIdPipe, TranslatePipe, SubMatrixPipe, GetBgClassPipe, CharacterToTilePipe, FilterCharactersPipe],
  exports: [ValidTileIdPipe, TranslatePipe, SubMatrixPipe, GetBgClassPipe, CharacterToTilePipe, FilterCharactersPipe],
})
export class PipesModule { }
