import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Character } from '../calculator/calculator.types';
import { CharacterService } from '../character-service/character-service.service';

export interface HeroSelectDialogData {

}

@Component({
  templateUrl: './hero-select-dialog.component.html',
  styleUrls: ['./hero-select-dialog.component.scss']
})
export class HeroSelectDialogComponent implements OnInit {

  public filterField = new FormControl();
  public onlyUniques = true;

  public characters: Array<Character>;
  public displayCharacters: Array<Character>;

  @ViewChild('heroFilter') private filterElement: ElementRef;

  @HostListener('window:keyup.Enter', ['$event'])
  onDialogClick(event: KeyboardEvent): void {
    //if (this.displayCharacters.length === 1) {
    this.dialogRef.close(this.displayCharacters[0]);
    //}
  }

  constructor(
    public dialogRef: MatDialogRef<HeroSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HeroSelectDialogData,
    private characterService: CharacterService
  ) {
    this.toggleRares();
    this.filterField.valueChanges.subscribe(() => {
      this.updateFilters();
    });
  }

  public heroSelected(hero: Character): void {
    this.dialogRef.close(hero);
  }

  public toggleRares() {
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
    const value: string = this.filterField.value;
    if (value && value.length > 0) {
      this.displayCharacters = this.characterService.fullCharList.filter((ch) => {
        const query = value.toLowerCase();
        return ch.id.toLowerCase().includes(query) ||
          ch.name.toLowerCase().includes(query) ||
          ch.alias?.some((al) => al.includes(query));
      });
    } else {
      this.displayCharacters = this.characters;
    }
  }
  
  ngOnInit() {
  }
}
