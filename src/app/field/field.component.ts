import { AfterViewChecked, AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Tile } from '../calculator/calculator.types';
import { LineService } from '../line/line.service';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit, AfterViewChecked {
  @Input() public matrix: Array<Tile> = [];

  constructor(private lineService: LineService) { }

  ngOnInit() {
  }

  public ngAfterViewChecked() {
    //console.log('ngAfterViewChecked');
    this.lineService.clearLines();
    this.matrix.forEach((tile) => {
      if (tile.targets) {
        // console.log(tile);
        // console.log('tile', tile.id, 'targets', tile.targets.id);
        this.lineService.createLine(
          'tile' + tile.id,
          'tile' + tile.targets.id,
          tile.lineColour
        )
      }
    });
  }

}
