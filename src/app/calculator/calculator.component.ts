import { Component, OnInit } from '@angular/core';
import { createParty, validTileId } from 'src/fn/helpers';
import { Party, Tile, LINE_LENGTH, LINE_HEIGHT, Coordinates, TileDistance, AiType, defaultAiType, TargetColour } from './calculator.types';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  public showAllyLinesChecked = true;
  public showEnemyLinesChecked = true;

  public aiTypes = Object.values(AiType);
  public goodParty: Party;
  public evilParty: Party;
  
  public events: Array<string> = [];

  // Handle when user clicks on the tile - set/unset value, recalc stuff
  public onTileClick = (tile: Tile) => {
    const party = this.returnParty(tile.id);
    console.log(party);
    const tileIndexInParty = party.tiles.findIndex((member) => member?.id === tile.id);

    if (~tileIndexInParty) {
      party.tiles[tileIndexInParty] = {
        id: null,
        value: '❓' + party.prefix + (tileIndexInParty + 1),
        aiType: party.tiles[tileIndexInParty].aiType
      };
      party.size = party.size - 1;
      const updatedTile: Tile = {
        ...tile,
        value: '',
        aiType: defaultAiType,
        targets: null
      }
      this.matrix[tile.id] = updatedTile;
    } else if (party.size < 4) {
      party.size = party.size + 1;
      const unusedIndex = party.tiles.findIndex((member) => !validTileId(member));
      const aiType = party.tiles[unusedIndex].aiType || defaultAiType;
      const updatedTile: Tile = {
        ...tile,
        value: aiType + party.prefix + String(unusedIndex + 1),
        aiType,
      }

      party.tiles[unusedIndex] = updatedTile;
      this.matrix[updatedTile.id] = updatedTile;
    }
    this.calculateEvents();
  }

  public onAiChange = (tile: Tile) => {
    const party = this.returnParty(tile.id);
    const tileIndexInParty = party.tiles.findIndex((member) => member?.id === tile.id);
    const updatedTile = {
      ...tile,
      value: tile.aiType + party.prefix + String(tileIndexInParty + 1) 
    }

    party.tiles[tileIndexInParty] = updatedTile;
    this.matrix[tile.id] = updatedTile;
    this.calculateEvents();
  }

  public generateMatrix = (): Array<Tile> => {
    return Array.from(new Array(LINE_LENGTH * LINE_HEIGHT), (_, i): Tile => {
      const posInLine = this.returnPositionInLine(i);
      const baseTile: Tile = {
        value: '',
        onClick: this.onTileClick,
        onAiChange: this.onAiChange,
        aiType: defaultAiType,
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

  public matrix: Array<Tile>;

  constructor() { }

  ngOnInit() {
    console.log('init')
    this.reset();
  }

  public reset() {
    this.matrix = this.generateMatrix();
    this.goodParty = createParty('Good', 'A');
    this.evilParty = createParty('Evil', 'E');
  }

  private returnPositionInLine(id: number): number {
    return (id % LINE_LENGTH) + 1;
  }

  private returnPositionInColumn(id: number): number {
    return Math.floor((id) / LINE_LENGTH) + 1;
  }

  private returnParty(id: number): Party {
    const posInLine = this.returnPositionInLine(id);
    if (posInLine < 5) {
      return this.goodParty;
    } if (posInLine > 10) {
      return this.evilParty;
    }
    throw Error('Invalid party id!');
  }

  private calcDistance(p1: Coordinates, p2: Coordinates): number {
    const a = p1.x - p2.x;
    const b = p1.y - p2.y;

    const c = Math.sqrt(a * a + b * b);

    return c;
  }

  private calcTeamTarget(attackers: Array<Tile>, defenders: Array<Tile>, lineColour: TargetColour) {
    const events: Array<string> = [];
    attackers.reduce((alreadyInTarget, attcker) => {
      attcker.targets = null;
      attcker.lineColour = null;
      if (!validTileId(attcker)) {
        return alreadyInTarget;
      }
      let potentialTargets: Array<Tile> = [];

      // Melee targets closest, untargeted
      if (attcker.aiType === AiType.Melee) {
        potentialTargets = defenders.filter((m) => !alreadyInTarget.includes(m) && validTileId(m));
        // If all targets are taken occupied, just take closest one
        if (!potentialTargets.length) {
          potentialTargets = defenders.filter(validTileId);
        }
      // Ranged targets closest target
      } else if (attcker.aiType === AiType.Ranged) {
        potentialTargets = defenders.filter(validTileId);
      }

      if (!potentialTargets.length) {
        return alreadyInTarget;
      }

      const attackerPos: Coordinates = {
        x: this.returnPositionInLine(attcker.id),
        y: this.returnPositionInColumn(attcker.id)
      }
      
      const target: TileDistance = potentialTargets.reduce((distanceArr, m) => {
        const defenderPos: Coordinates = {
          x: this.returnPositionInLine(m.id),
          y: this.returnPositionInColumn(m.id)
        }
        const distance = this.calcDistance(attackerPos, defenderPos);
        distanceArr.push({
          distance,
          tile: m
        });
        return distanceArr;
      }, [] as Array<TileDistance>).sort((a, b) => a.distance - b.distance)[0];

      if (
        (lineColour === TargetColour.Ally && this.showAllyLinesChecked) ||
        (lineColour === TargetColour.Enemy && this.showEnemyLinesChecked)
      ) {
        attcker.targets = target.tile;
        attcker.lineColour = lineColour;
      }
      events.push(`${attcker.value} targets ${target.tile.value} with a distance of ${target.distance.toFixed(2)}`);
      alreadyInTarget.push(target.tile);

      return alreadyInTarget;
    }, [] as Array<Tile>);
    return events;
  }

  public calculateEvents() {
    const newEvents = [
      ...this.calcTeamTarget(this.goodParty.tiles, this.evilParty.tiles, TargetColour.Ally),
      ...this.calcTeamTarget(this.evilParty.tiles, this.goodParty.tiles, TargetColour.Enemy)
    ];
    this.events = newEvents;
    this.matrix = [...this.matrix];
  }

}
