import { Party, Tile } from "src/app/calculator/calculator.types"

export function createParty(name: string, prefix: string): Party {
  return {
    name,
    prefix,
    size: 0,
    tiles: Array.from(new Array(4), (_, i) => {
      return {
        id: null,
        value: '❓' + prefix + (i + 1)
      }
    }),
  }
}

export function validTileId(tile: Tile) {
  return tile && tile.id !== null && tile.id !== undefined && !isNaN(tile.id);
}

