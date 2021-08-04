import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Tile } from 'src/app/calculator/calculator.types';
import { validTileId } from 'src/fn/helpers';

export enum CharType {
  Melee = '🗡️',
  Ranged = '🏹',
}

@Component({
  selector: 'app-ai-toggle',
  templateUrl: './ai-toggle.component.html',
  styleUrls: ['./ai-toggle.component.scss']
})
export class AiToggleComponent implements OnInit, OnChanges {
  @Input() public tile: Tile = null;
  public isChecked: boolean;

  constructor() { }

  ngOnInit() {
  }

  public ngOnChanges() {
    //this.isChecked = !validTileId(this.tile) ? true: this.tile.aiType === CharType.Ranged;
  }

  public onUpdateToggle(e: any) {
    const updatedAiType = e as CharType;
    this.tile.onAiChange({
      ...this.tile,
      //aiType: updatedAiType
    });
  }

}
