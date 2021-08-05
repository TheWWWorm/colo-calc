import { Character, RawChar, TranslatedChar } from "../calculator/calculator.types"

import characters from '../character-service/characters.json';

import enChars from './translations/characters_en.json';
import enLabels from './translations/en.json';

import ruChars from './translations/characters_ru.json';
import ruLabels from './translations/ru.json';

export enum Language {
  en = 'English',
  ru = 'Русский'
};

export const languageList = [Language.en, Language.ru]

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
  }
}
