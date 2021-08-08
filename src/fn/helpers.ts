import { Party, Tile } from "src/app/calculator/calculator.types"

export function createParty(name: string, updateParty: Party['updateParty']): Party {
  return {
    name,
    size: 0,
    tiles: Array.from(new Array(4), (_, i) => {
      return {
        id: null,
      }
    }),
    updateParty
  }
}

export function validTileId(tile: Tile) {
  return tile && tile.id !== null && tile.id !== undefined && !isNaN(tile.id);
}

