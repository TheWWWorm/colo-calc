import { Pipe, PipeTransform } from "@angular/core";
import { Character, Tile } from "../calculator/calculator.types";

@Pipe({
  name: 'characterToTile'
})
export class CharacterToTilePipe implements PipeTransform {
  public transform(character: Character): Tile {
    return {
      character,
      id: null,
    }
  }
}
