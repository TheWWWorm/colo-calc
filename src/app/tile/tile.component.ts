import { Component, Input, OnChanges } from '@angular/core';
import { CalculatorComponent } from '../calculator/calculator.component';
import { CharacterClass, Element, Tile } from '../calculator/calculator.types';

export const leadIcon = `assets/icons/icon_lead.png`;

export const elementIconMap : {
  [key in Element]: string;
} = {
  [Element.Basic]: `assets/icons/icon_basic.jpg`,
  [Element.Dark]: `assets/icons/icon_dark.jpg`,
  [Element.Light]: `assets/icons/icon_light.jpg`,
  [Element.Fire]: `assets/icons/icon_fire.jpg`,
  [Element.Water]: `assets/icons/icon_water.jpg`,
  [Element.Earth]: `assets/icons/icon_earth.jpg`,
}

export const classIconMap : {
  [key in CharacterClass]: string;
} = {
  [CharacterClass.Tank]: `assets/icons/icon_tank.jpg`,
  [CharacterClass.Warrior]: `assets/icons/icon_warrior.jpg`,
  [CharacterClass.Ranged]: `assets/icons/icon_ranged.jpg`,
  [CharacterClass.Support]: `assets/icons/icon_support.jpg`,
}


@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnChanges {
  @Input() public tile: Tile = null;
  @Input() public textValue = '';
  @Input() public disabled = false;

  public tileBackground: string;
  public tileElement: string;
  public tileLead: string;
  public tileClass: string;

  constructor() { }

  public ngOnChanges(): void {
    if (this.tile?.character) {
      const { character, positionInParty } = this.tile;
      this.tileBackground = character.imgName;
      if (positionInParty === 0) {
        this.tileLead = leadIcon;
      } else {
        this.tileLead = null;
      }
      this.tileClass = classIconMap[character.class];
      this.tileElement = elementIconMap[character.element];
    } else if (this.tile) {
      const posInLine = CalculatorComponent.returnPositionInLine(this.tile.id);
      if (posInLine < 5) {
        this.tileBackground = `/assets/blue_tile.png`;
      } else if (posInLine > 10) {
        this.tileBackground = `/assets/red_tile.png`;
      } else {
        this.tileBackground = null;
      }
      this.tileLead = null;
      this.tileClass = null;
      this.tileElement = null;
    } else {
      this.tileBackground = null;
      this.tileLead = null;
      this.tileClass = null;
      this.tileElement = null;
    }
  }

  public clicked() {
    if (this.tile?.disabled || !this.tile || !this.tile.onClick || this.disabled) {
      return;
    }
    this.tile.onClick(this.tile);
  }
}
