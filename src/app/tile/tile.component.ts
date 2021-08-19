import { Component, Input, OnChanges } from '@angular/core';
import { CalculatorComponent } from '../calculator/calculator.component';
import { Tile } from '../calculator/calculator.types';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnChanges {
  @Input() public tile: Tile = null;

  public tileBackground: string;

  constructor() { }

  public ngOnChanges(): void {
    if (this.tile.character) {
      this.tileBackground = this.tile.character.imgName;
    } else {
      const posInLine = CalculatorComponent.returnPositionInLine(this.tile.id);
      if (posInLine < 5) {
        this.tileBackground = `/assets/blue_tile.png`;
      } else if (posInLine > 10) {
        this.tileBackground = `/assets/red_tile.png`;
      } else {
        this.tileBackground = null;
      }
    }
  }

  public clicked() {
    if (this.tile.disabled) {
      return;
    }
    this.tile.onClick(this.tile);
  }
}
