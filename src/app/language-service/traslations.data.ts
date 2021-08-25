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

import ptbrChars from './translations/characters_pt-br.json';
import ptbrLabels from './translations/pt-br.json';

import eslaChars from './translations/characters_es-la.json';
import eslaLabels from './translations/es-la.json';

export enum Language {
  en = 'English',
  de = 'Deutsch',
  esla = 'Español latino',
  ptbr = 'Português Brasileiro',
  ru = 'Русский',
  zhtw = '繁體中文',
};

export enum Background {
  Solid = 'backgroundSolid',
  Library = 'backgroundLibrary',
  Lava = 'backgroundLava',
};

export const BrowserLangCodeMap = {
  'de': Language.de,
  'ru': Language.ru,
  'ru-ru': Language.ru,
  'zh-tw': Language.zhtw,
  'en': Language.en,
  'pt-br': Language.ptbr,
  'pt': Language.ptbr,
  'br': Language.ptbr,
  'es': Language.esla,
  'es-la': Language.esla
};

export const languageList = [Language.en, Language.de, Language.esla, Language.ptbr, Language.ru, Language.zhtw]
export const backGroundList = [Background.Solid, Background.Library, Background.Lava]

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
  [Language.ptbr]:  {
    labels: ptbrLabels,
    characters: applyCharacterLang(ptbrChars)
  },
  [Language.esla]:  {
    labels: eslaLabels,
    characters: applyCharacterLang(eslaChars)
  },
}
