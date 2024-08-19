import { validTileId } from "src/fn/helpers";
import { CalculatorComponent } from "./calculator.component";
import { LINE_HEIGHT, LINE_LENGTH, Party, Tile } from "./calculator.types";

export const generateMatrix = (params?: {
  lenght?: number;
  height?: number;
  onTileClick?: (tile: Tile) => void;
  onChangeCharacter?: (tile: Tile) => void;
}): Array<Tile> => {
  params = {
    lenght: LINE_LENGTH,
    height: LINE_HEIGHT,
    onTileClick: (tile: Tile) => {},
    onChangeCharacter: (tile: Tile) => {},
    ...params,
  }
  return Array.from(new Array(params.lenght * params.height), (_, i): Tile => {
    const posInLine = CalculatorComponent.returnPositionInLine(i);
    const baseTile: Tile = {
      value: '',
      onClick: params.onTileClick,
      onChangeCharacter: params.onChangeCharacter,
      id: i
    }
    if (posInLine < 5) {
      return baseTile;
    } else if (posInLine > 4 && posInLine < 11) {
      return {
        ...baseTile,
        disabled: true,
        value: 'x'
      };
    }
    return baseTile;
  });
}

export const syncMatrixToTeams = (matrix: Array<Tile>, parties: Array<Party> = []) => {
  const updMatrix = matrix.map((tile) => {
    return {
      ...tile,
      character: null,
      positionInParty: null,
      targets: null,
      summonTargets: null,
    }
  });
  parties.forEach((party) => {
    syncParty(party, updMatrix);
  })
  return updMatrix;
}

export const syncParty = (party: Party, matrix: Array<Tile>) => {
  party.tiles.forEach((tile) => {
    if (validTileId(tile)) {
      matrix[tile.id] = tile;
    }
  });
}
