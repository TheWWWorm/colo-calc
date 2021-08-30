import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character, SelectOption } from '../calculator/calculator.types';
import { LocalStorageService } from '../local-storage-service/local-storage-service.service';
import { Background, backGroundList, BrowserLangCodeMap, LabelKeys, Language, mappedLangData } from './traslations.data';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public language: Language = this.localStorageService.get('lang') || this.findBrowserLanguage() || Language.en;
  public characterList$: BehaviorSubject<Array<Character>>;

  public background = this.localStorageService.get('bg') || Background.Solid;
  public backgroundList$: BehaviorSubject<Array<SelectOption>>;

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
    this.backgroundList$ =  new BehaviorSubject(null);
    this.setBackgoundList();
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

  public setBackgoundList() {
    this.backgroundList$.next(
      backGroundList.map((bgName) => {
        return {
          code: bgName,
          description: this.getLabel(bgName)
        }
      })
    )
  }

  public changeLang(lang: Language) {
    this.language = lang;
    this.localStorageService.set('lang', lang);
    this.characterList$.next(mappedLangData[this.language].characters);
    this.setBackgoundList();
  }

  public changeBg(bg: string) {
    this.background = bg;
    this.localStorageService.set('bg', bg);
  }

  public getLabel(label: LabelKeys, fallback = true): string {
    let translatedLabel: string = mappedLangData[this.language as Language.en].labels[label];
    if (!translatedLabel && fallback) {
      translatedLabel = mappedLangData[Language.en].labels[label] || label;
    }
    return translatedLabel;
  }
}
