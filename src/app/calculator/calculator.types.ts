export const LINE_LENGTH = 14;
export const LINE_HEIGHT = 5;

export enum TargetColour {
  Ally = '#f3ff81b3',
  Enemy = '#ff1818ba'
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

export interface RawChar {
  id: string;
  aiType: AiType;
  fallbackAiType?: AiType;
  class: CharacterClass;
  imgName: string;
  isSummon?: boolean;
  isRare?: boolean;
  isSecret?: boolean;
  summonName?: string;
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
  lineColour?: TargetColour;
}

export interface Party {
  name: string;
  size: number;
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
