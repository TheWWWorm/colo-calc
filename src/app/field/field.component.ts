import { AfterViewChecked, AfterViewInit, Component, Input, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Tile } from '../calculator/calculator.types';
import { LineService } from '../line/line.service';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit, OnChanges {
  @Input() public matrix: Array<Tile> = [];
  // @TODO: change
  @Input() public doClears = false;

  constructor(
    private lineService: LineService
  ) { }

  ngOnInit() {
  }

  public drawLines() {
    if (this.doClears) {
      this.lineService.clearLines();
    }
    this.matrix.forEach((tile) => {
      if (tile.targets) {
        this.lineService.createLine(
          'tile' + tile.id,
          'tile' + tile.targets.id,
          tile.lineColour
        )
      }
      if (tile.summonTargets) {
        this.lineService.createLine(
          'tile' + tile.id,
          'tile' + tile.summonTargets.id,
          tile.summonLineColour,
          true
        )
      }
    });
  }
 
  public ngOnChanges(changes: SimpleChanges): void {
    try {
      this.drawLines();
    } catch (error) {
      console.error(error)
      try {
        setTimeout(() => this.drawLines(), 100);
      } catch (error) {
        console.error('We tried :(', error)
      }
    }
  }
}
