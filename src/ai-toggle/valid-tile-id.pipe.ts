import { Pipe, PipeTransform } from '@angular/core';
import { Tile } from 'src/app/calculator/calculator.types';
import { validTileId } from '../fn/helpers';

@Pipe({
  name: 'validTileId'
})
export class ValidTileIdPipe implements PipeTransform {
  transform(tile: Tile): boolean {
    return validTileId(tile);
  }
}
