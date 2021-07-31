import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AiType, Tile } from 'src/app/calculator/calculator.types';
import { validTileId } from 'src/fn/helpers';

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
    this.isChecked = !validTileId(this.tile) ? true: this.tile.aiType === AiType.Ranged;
  }

  public onUpdateToggle(e: any) {
    const updatedAiType = e as AiType;
    this.tile.onAiChange({
      ...this.tile,
      aiType: updatedAiType
    });
  }

}
