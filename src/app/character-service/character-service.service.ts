import { Injectable } from '@angular/core';
import { Character } from '../calculator/calculator.types';
import characters from './characters.json';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  public fullCharList: Array<Character> = characters.map((ch) => {
    return {
      ...ch,
      imgName: `/assets/CharacterPortraits/${ch.imgName}`
    } as Character
  })
  public charList: Array<Character> = this.fullCharList.filter((ch) => !ch.isSummon);
  public summonList: Array<Character> = this.fullCharList.filter((ch) => ch.isSummon);
  public uniqueList: Array<Character> = this.charList.filter((ch) => !ch.isRare);

  public defaultCharacter = this.charList[0];

  constructor() { }

  public getCharacter(name: string) {
    return this.charList.find((c) => c.name === name) || this.defaultCharacter;
  }

}
