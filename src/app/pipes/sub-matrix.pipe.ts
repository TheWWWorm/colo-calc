import { Pipe, PipeTransform } from "@angular/core";
import { validTileId } from "src/fn/helpers";
import { CalculatorComponent } from "../calculator/calculator.component";
import { Tile } from "../calculator/calculator.types";

@Pipe({
  name: 'subMatrix'
})
export class SubMatrixPipe implements PipeTransform {
  public transform(matrix: Array<Tile>, side: 'good' | 'bad'): Array<Tile> {
    return matrix.filter((tile) => {
      const posInLine = CalculatorComponent.returnPositionInLine(tile.id);
      if (posInLine < 5 && side === 'good') {
        return true
      } else if (posInLine > 10 && side === 'bad') {
        return true
      }
      return false
    });
  }
}
