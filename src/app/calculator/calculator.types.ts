export const LINE_LENGTH = 14;
export const LINE_HEIGHT = 5;

export enum TargetColour {
  Ally = '#f3ff81b3',
  Enemy = '#ff1818ba',
  AllySummon = '#7c56baba',
  EnemySummon = '#d64bc3ba',
}

export enum AiType {
  Melee = 'Melee',
  Ranged = 'Ranged',
  Ally = 'Ally',
  Assassin = 'Assassin',
}

export enum CharacterClass {
  Warrior = 'Warrior',
  Ranged = 'Ranged',
  Support = 'Support',
  Tank = 'Tank',
}

export enum Element {
  Dark = 'Dark',
  Light = 'Light',
  Basic = 'Basic',
  Earth = 'Earth',
  Water = 'Water',
  Fire = 'Fire',
}

export enum ChainType {
  All = 'All',
  Airborne = 'Airborne',
  Injured = 'Injured',
  Downed = 'Downed'
}

export interface RawChar {
  id: string;
  aiType: AiType;
  fallbackAiType?: AiType;
  chainsFrom?: ChainType;
  chainsTo?: ChainType;
  class: CharacterClass;
  element: Element;
  imgName: string;
  jpImgName?: string;
  isSummon?: boolean;
  isRare?: boolean;
  isSecret?: boolean;
  summonId?: string;
};

export interface TranslatedChar {
  name: string;
  alias?: Array<string>
};

export type Character = RawChar & TranslatedChar;

export interface Tile {
  id: number;
  positionInParty?: number;
  value?: string;
  character?: Character;
  disabled?: boolean;
  onClick?: (tile: Tile) => void;
  onChangeCharacter?: (tile: Tile) => void;
  targets?: Tile;
  summonTargets?: Tile;
  lineColour?: TargetColour;
  summonLineColour?: TargetColour;
}

export interface Party {
  name: string;
  tiles: Array<Tile>,
  updateParty: (party: Party) => void;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface TileDistance {
  tile: Tile;
  distance: number;
}

export interface SelectOption {
  code: string;
  description: string;
}

export const dialogWidth: string = '700px';

export enum PartyTypes {
  good = 'Good',
  evil = 'Evil'
}