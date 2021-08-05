import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '../calculator/calculator.types';
import { LabelKeys, Language, mappedLangData } from './traslations.data';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public language = Language.en;
  public characterList$ = new BehaviorSubject<Array<Character>>(mappedLangData[this.language].characters);

  constructor() { }

  public changeLang(lang: Language) {
    this.language = lang;
    this.characterList$.next(mappedLangData[this.language].characters);
  }

  public getLabel(label: LabelKeys): string {
    return mappedLangData[this.language as Language.en].labels[label] ||
    mappedLangData[Language.en].labels[label] || label;
  }
}
