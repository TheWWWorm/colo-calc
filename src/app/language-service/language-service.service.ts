import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '../calculator/calculator.types';
import { LocalStorageService } from '../local-storage-service/local-storage-service.service';
import { BrowserLangCodeMap, LabelKeys, Language, mappedLangData } from './traslations.data';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public language: Language = this.localStorageService.get('lang') || this.findBrowserLanguage() || Language.en;
  public characterList$: BehaviorSubject<Array<Character>>; 

  constructor(
    private localStorageService: LocalStorageService
  ) {
    let charList = mappedLangData[this.language]?.characters;
    if (!charList) {
      this.language = Language.en;
      this.localStorageService.set('lang', this.language);
      charList = mappedLangData[Language.en].characters;
    }
    this.characterList$ = new BehaviorSubject<Array<Character>>(charList);
  }

  public findBrowserLanguage(): Language {
    try {
      const languages = window.navigator.languages;
      return languages.reduce((foundLang: Language, lang) => {
        if (foundLang) {
          return foundLang;
        }
        foundLang = BrowserLangCodeMap[(lang.toLowerCase() as keyof typeof BrowserLangCodeMap)];
        return foundLang;
      }, null) || Language.en;
    } catch (error) {
      return Language.en;
    }
  }

  public changeLang(lang: Language) {
    this.language = lang;
    this.localStorageService.set('lang', lang);
    this.characterList$.next(mappedLangData[this.language].characters);
  }

  public getLabel(label: LabelKeys): string {
    return mappedLangData[this.language as Language.en].labels[label] ||
    mappedLangData[Language.en].labels[label] || label;
  }
}
