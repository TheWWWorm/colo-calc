import { Component, Input, OnChanges } from '@angular/core';
import { CalculatorComponent } from '../calculator/calculator.component';
import { Character, CharacterClass, Element, Tile } from '../calculator/calculator.types';
import { CharacterService } from '../character-service/character-service.service';
import { LocalStorageService } from '../local-storage-service/local-storage-service.service';

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

export const transparentElementIconMap : {
  [key in Element]: string;
} = {
  [Element.Basic]: `assets/element_icons_transparent/basic.png`,
  [Element.Dark]: `assets/element_icons_transparent/dark.png`,
  [Element.Light]: `assets/element_icons_transparent/light.png`,
  [Element.Fire]: `assets/element_icons_transparent/fire.png`,
  [Element.Water]: `assets/element_icons_transparent/water.png`,
  [Element.Earth]: `assets/element_icons_transparent/earth.png`,
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
  @Input() public showPlus = false;
  @Input() public disabled = false;

  public tileBackground: string;
  public tileSummonBackground: string;
  public tileElement: string;
  public tileLead: string;
  public tileClass: string;

  public summon: Character;

  constructor(
    private characterService: CharacterService,
    private localStorageService: LocalStorageService,
  ) { }

  public ngOnChanges(): void {
    if (this.tile?.character) {
      const { character, positionInParty } = this.tile;
      this.tileBackground = this.characterService.useJPArt ? character.jpImgName : character.imgName;
      if (positionInParty === 0) {
        this.tileLead = leadIcon;
      } else {
        this.tileLead = null;
      }
      this.tileClass = classIconMap[character.class];
      this.tileElement = elementIconMap[character.element];

      if (this.tile.character.summonId) {
        this.summon = this.characterService.getCharacter(this.tile.character.summonId);
        this.tileSummonBackground = this.characterService.useJPArt ? this.summon.jpImgName : this.summon.imgName;
      }
    } else if (this.tile) {
      const posInLine = CalculatorComponent.returnPositionInLine(this.tile.id);
      if (posInLine < 5) {
        this.tileBackground = this.localStorageService.get('kangMode') ? `/assets/blue_tile_kang.png` : `/assets/blue_tile.png`;
      } else if (posInLine > 10) {
        this.tileBackground = this.localStorageService.get('kangMode') ? `/assets/red_tile_kang.png` :`/assets/red_tile.png`;
      } else {
        this.tileBackground = null;
      }
      this.tileLead = null;
      this.tileClass = null;
      this.tileElement = null;
      this.summon = null;
    } else {
      this.tileBackground = null;
      this.tileLead = null;
      this.tileClass = null;
      this.tileElement = null;
      this.summon = null;
    }
  }

  public clicked() {
    if (this.tile?.disabled || !this.tile || !this.tile.onClick || this.disabled) {
      return;
    }
    this.tile.onClick(this.tile);
  }

  public imgErrored() {
    this.tileBackground = this.tile?.character?.imgName;
  }

  public imgSummonErrored() {
    this.tileSummonBackground = this.summon?.imgName;
  }
}
