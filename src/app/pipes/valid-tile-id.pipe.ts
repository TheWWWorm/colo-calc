import { Pipe, PipeTransform } from "@angular/core";
import { validTileId } from "src/fn/helpers";
import { Tile } from "../calculator/calculator.types";

@Pipe({
  name: 'validTileId'
})
export class ValidTileIdPipe implements PipeTransform {
  public transform(tile: Tile): boolean {
    return validTileId(tile);
  }
}
