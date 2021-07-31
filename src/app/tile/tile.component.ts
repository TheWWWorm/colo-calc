import { Component, Input, OnInit } from '@angular/core';
import { Tile } from '../calculator/calculator.types';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  @Input() public tile: Tile = null;

  constructor() { }

  ngOnInit() {
  }

  public clicked() {
    if (this.tile.disabled) {
      return;
    }
    this.tile.onClick(this.tile);
  }
}
