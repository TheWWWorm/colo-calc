import { Injectable } from '@angular/core';
import { Character } from '../calculator/calculator.types';
import { LanguageService } from '../language-service/language-service.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  public fullCharList: Array<Character>;
  public charList: Array<Character>;
  public summonList: Array<Character>;
  public uniqueList: Array<Character>;

  public defaultCharacter: Character;

  constructor(private languageService: LanguageService) {
    this.languageService.characterList$.subscribe((characters) => {
      this.fullCharList = characters.map((ch) => {
        return {
          ...ch,
          imgName: `/assets/CharacterPortraits/${ch.imgName}`,
          jpImgName: ch.jpImgName ? `/assets/CharacterPortraitsJP/${ch.jpImgName}` : '',
        } as Character
      });
      this.charList = this.fullCharList.filter((ch) => !ch.isSummon && !ch.isSecret);
      this.summonList = this.fullCharList.filter((ch) => ch.isSummon);
      this.uniqueList = this.charList.filter((ch) => !ch.isRare);
      this,this.defaultCharacter = this.charList[0];
    });
  }

  public getCharacter(id: string) {
    return this.fullCharList.find((c) => c.id === id) || this.defaultCharacter;
  }

}
