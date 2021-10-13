import { Party, Tile } from "src/app/calculator/calculator.types"

export function createParty(name: string, updateParty: Party['updateParty']): Party {
  return {
    name,
    tiles: Array.from(new Array(4), (_, i) => {
      return {
        id: null,
      }
    }),
    updateParty
  }
}

export function validTileId(tile: Tile) {
  return tile && validId(tile.id);
}

export function validId(id: number) {
  return id !== null && id !== undefined && !isNaN(id);
}
