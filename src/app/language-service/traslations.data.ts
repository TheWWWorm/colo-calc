import { Character, RawChar, TranslatedChar } from "../calculator/calculator.types"

import characters from '../character-service/characters.json';

import enChars from './translations/characters_en.json';
import enLabels from './translations/en.json';

import ruChars from './translations/characters_ru.json';
import ruLabels from './translations/ru.json';

import zhtwChars from './translations/character_zh-tw.json';
import zhtwLabels from './translations/zh-tw.json';

import deChars from './translations/characters_de.json';
import deLabels from './translations/de.json';

export enum Language {
  en = 'English',
  ru = 'Русский',
  zhtw = '繁體中文',
  de = 'Deutsch'
};

export const BrowserLangCodeMap = {
  'de': Language.de,
  'ru': Language.ru,
  'ru-ru': Language.ru,
  'zh-tw': Language.zhtw,
  'en': Language.en
};

export const languageList = [Language.en, Language.de, Language.ru, Language.zhtw]

export type LabelKeys = keyof typeof enLabels;

export type MappedLanguages = {
  [key in Language]: {
    characters: Array<Character>,
    labels: {
      [key in LabelKeys]: string
    }
  }
};

function applyCharacterLang(translated: {
  [key in string]: TranslatedChar
}): Array<Character> {
  return (characters as Array<RawChar>).map((char): Character => {
    const translatedChar = translated[char.id];
    return {
      ...char,
      name: translatedChar?.name || char.id,
      alias: translatedChar?.alias || []
    }
  });
}

export const mappedLangData = {
  [Language.en]: {
    labels: enLabels,
    characters: applyCharacterLang(enChars)
  },
  [Language.ru]: {
    labels: ruLabels,
    characters: applyCharacterLang(ruChars)
  },
  [Language.zhtw]:  {
    labels: zhtwLabels,
    characters: applyCharacterLang(zhtwChars)
  },
  [Language.de]:  {
    labels: deLabels,
    characters: applyCharacterLang(deChars)
  },
}
