import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { validId, validTileId } from 'src/fn/helpers';
import { Character, dialogWidth, Party, Tile, Weapon } from '../calculator/calculator.types';
import { CharacterService } from '../character-service/character-service.service';
import { LocalStorageService } from '../local-storage-service/local-storage-service.service';
import { transparentElementIconMap } from '../tile/tile.component';
import { WeaponSelectDialogComponent } from '../weapon-select-dialog/weapon-select-dialog.component';

export interface HeroSelectDialogData {
  party: Party;
  index: number;
  tile?: Tile;
}

@Component({
  templateUrl: './hero-select-dialog.component.html',
  styleUrls: ['./hero-select-dialog.component.scss']
})
export class HeroSelectDialogComponent implements OnInit {
  public filterField = new FormControl();
  public onlyUniques = this.localStorageService.get('onlyUniques');
  public separateByElement = this.localStorageService.get('separateByElement');

  public characters: Array<Character>;
  public displayCharacters: Array<Character>;

  public elements = transparentElementIconMap;

  public selectedChars: Array<Character>

  @ViewChild('heroFilter') private filterElement: ElementRef;

  @HostListener('window:keyup.Enter', ['$event'])
  onDialogClick(event: KeyboardEvent): void {
    //if (this.displayCharacters.length === 1) {
    this.heroSelected(this.displayCharacters[0])
    //}
  }

  constructor(
    public dialogRef: MatDialogRef<HeroSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HeroSelectDialogData,
    private characterService: CharacterService,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog
  ) {
    if (this.data.party) {
      this.selectedChars = this.data.party.tiles.reduce((acc, tile) => {
        if (tile.character) {
          acc.push(tile.character);
        }
        return acc;
      }, []);
    }

    // Filter those out by default
    if (this.onlyUniques === null) {
      this.onlyUniques = true;
    }
    // Enable by default
    if (this.separateByElement === null) {
      this.separateByElement = true;
    }
    this.toggleRares();
    this.filterField.valueChanges.subscribe(() => {
      this.updateFilters();
    });
  }
  
  // If selected hero exists and this party slot has a hero - swap them
  // If selected hero exists and this party slot doesn't have a hero - remove the hero from old spot 
  public handleExistingHero(character: Character) {
    const { index, party, tile } = this.data;
    const heroExistsAt = party.tiles.findIndex((tile) => tile?.character?.id === character.id);
    if (~heroExistsAt) {
      if (party.tiles[index].character?.id) {
        party.tiles[heroExistsAt] = {
          ...party.tiles[heroExistsAt],
          character: party.tiles[index].character
        }
      } else {
        party.tiles[heroExistsAt] = {
          ...party.tiles[heroExistsAt],
          id: null,
          character: null,
        }
      }
    }

    party.tiles[index] = {
      ...party.tiles[index],
      positionInParty: index,
      character: character,
      id: validTileId(tile) ? tile.id : party.tiles[index].id,
    }

    if (tile) {
      party.tiles[index].onChangeCharacter = tile.onChangeCharacter;
      party.tiles[index].onClick = tile.onClick;
    }

    const tiles = [...party.tiles];
    if (character) {
      party.updateParty({
        ...party,
        tiles
      })
    }
  }

  public heroSelected(character: Character): void {
    if (character.weapons?.length) {
      this.dialog.open(WeaponSelectDialogComponent, {
        //width: dialogWidth,
        data: {
          weapons: character.weapons
        }
      }).afterClosed().pipe(first()).subscribe((weapon: Weapon) => {
        const characterWithWeapon = this.characterService.getCharacterWithWeapon(character.id, weapon.id);
        this.handleExistingHero(characterWithWeapon);
        this.dialogRef.close(characterWithWeapon);
      })
    } else {
      this.handleExistingHero(character);
      this.dialogRef.close(character);
    }
  }

  public toggleRares() {
    this.localStorageService.set('onlyUniques', this.onlyUniques);
    this.localStorageService.set('separateByElement', this.separateByElement);
    if (this.onlyUniques) {
      this.characters = this.characterService.uniqueList;
    } else {
      this.characters = this.characterService.charList;
    }
    this.displayCharacters = this.characters;
    this.updateFilters();
  }


  // Allow filtering by hero types
  // Also show more hero info on hover!
  public updateFilters() {
    let value: string = this.filterField.value;
    if (value && value.length > 0) {
      value = value.trim();
      this.displayCharacters = this.characterService.fullCharList.filter((ch) => {
        const query = value.toLowerCase();
        return ch.id.toLowerCase().includes(query) ||
          ch.name.toLowerCase().includes(query) ||
          ch.alias?.some((al) => al.toLowerCase().includes(query));
      });
    } else {
      this.displayCharacters = this.characters;
    }

    // if (this.selectedChars.length) {
    //   this.displayCharacters = this.displayCharacters.filter((char) => {
    //     return !this.selectedChars.find((selectedChar) => selectedChar.id === char.id);
    //   });
    // }
  }

  ngOnInit() {
  }
}
