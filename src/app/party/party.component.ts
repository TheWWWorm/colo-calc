import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Character, Party } from '../calculator/calculator.types';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss']
})
export class PartyComponent implements OnChanges {

  @Input() public party: Party;
  @Input() public title: string;

  public heroList: Array<Character>;

  constructor() { }

  public ngOnChanges(changes: SimpleChanges): void {
    console.log('changes!')
    this.heroList = this.party.tiles.map((tile) => tile.character);
  }

  public changeHero(i: number) {
    this.party.tiles[i]?.onChangeCharacter(this.party.tiles[i]);
  }

}
