import { Character, RawChar, TranslatedChar } from "../calculator/calculator.types"

import characters from '../character-service/characters.json';

import enChars from './translations/characters_en.json';
import enLabels from './translations/en.json';

import ruChars from './translations/characters_ru.json';
import ruLabels from './translations/ru.json';

import zhtwChars from './translations/character_zh-tw.json';
import zhtwLabels from './translations/zh-tw.json';

import zhcnChars from './translations/characters_zh-cn.json';
import zhcnLabels from './translations/zh-cn.json';

import jpChars from './translations/characters_jp.json';
import jpLabels from './translations/jp.json';

import deChars from './translations/characters_de.json';
import deLabels from './translations/de.json';

import ptbrChars from './translations/characters_pt-br.json';
import ptbrLabels from './translations/pt-br.json';

import eslaChars from './translations/characters_es-la.json';
import eslaLabels from './translations/es-la.json';

import pirateChars from './translations/characters_pirate.json';
import pirateLabels from './translations/pirate.json';

export enum Language {
  en = 'English',
  de = 'Deutsch',
  esla = 'Español latino',
  ptbr = 'Português Brasileiro',
  ru = 'Русский',
  zhtw = '繁體中文',
  zhcn = '语言',
  jp = '日本語',
  pirate = 'Pirate',
};

export enum Background {
  Solid = 'backgroundSolid',
  Library = 'backgroundLibrary',
  Lava = 'backgroundLava',
  Desert = 'backgroundDesert',
  Dungeon = 'backgroundDungeon',
  Chess = 'backgroundChess',
  Training = 'backgroundTraining',
  Kamazone = 'backgroundKamazone',
  Snow = 'backgroundSnow',
  Arena = 'backgroundArena',
};

export const BrowserLangCodeMap = {
  'de': Language.de,
  'ru': Language.ru,
  'ru-ru': Language.ru,
  'zh-tw': Language.zhtw,
  'zh-cn': Language.zhcn,
  'en': Language.en,
  'pt-br': Language.ptbr,
  'pt': Language.ptbr,
  'br': Language.ptbr,
  'es': Language.esla,
  'es-la': Language.esla,
  'es-ar': Language.esla,
  'ja-jp': Language.jp,
  'jp-jp': Language.jp,
  'ja-ja': Language.jp,
};

export const languageList = [Language.en, Language.de, Language.esla, Language.ptbr, Language.ru, Language.zhtw, Language.zhcn, Language.jp, Language.pirate];
export const backGroundList = [Background.Solid, Background.Chess, Background.Training, Background.Library, Background.Lava, Background.Desert, Background.Dungeon, Background.Kamazone, Background.Snow, Background.Arena];

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
  [Language.zhcn]: {
    labels: zhcnLabels,
    characters: applyCharacterLang(zhcnChars)
  },
  [Language.jp]:  {
    labels: jpLabels,
    characters: applyCharacterLang(jpChars)
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
  [Language.pirate]:  {
    labels: pirateLabels,
    characters: applyCharacterLang(pirateChars)
  },
}
