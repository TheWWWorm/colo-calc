import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { validTileId } from 'src/fn/helpers';
import { Character, Party } from '../calculator/calculator.types';
import { HeroSelectDialogComponent } from '../hero-select-dialog/hero-select-dialog.component';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss']
})
export class PartyComponent implements OnChanges {

  @Input() public party: Party;
  @Input() public title: string;

  public heroList: Array<Character>;

  constructor(
    public dialog: MatDialog
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    this.heroList = this.party.tiles.map((tile) => tile.character);
  }

  public changeHero(i: number) {
    const tile = this.party.tiles[i];
    if (validTileId(tile)) {
      this.party.tiles[i]?.onChangeCharacter(this.party.tiles[i]);
    } else {
      this.preSelectHero(i);
    }
  }

  public preSelectHero(i: number) {
    const dialogRef = this.dialog.open(HeroSelectDialogComponent, {
      width: '700px',
      data: {}
    })
    return dialogRef.afterClosed().subscribe((character) => {
      const tiles = [...this.party.tiles];
      tiles[i] = {
        ...tiles[i],
        character
      }
      if (character) {
        this.party.updateParty({
          ...this.party,
          tiles
        })
      }
    })
  }

}
