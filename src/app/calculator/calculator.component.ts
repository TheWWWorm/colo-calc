import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { createParty, validTileId } from 'src/fn/helpers';
import { CharacterService } from '../character-service/character-service.service';
import { HeroSelectDialogComponent } from '../hero-select-dialog/hero-select-dialog.component';
import { LanguageService } from '../language-service/language-service.service';
import { languageList } from '../language-service/traslations.data';
import { LocalStorageService } from '../local-storage-service/local-storage-service.service';
import { ShareDialogComponent } from '../share-dialog/share-dialog.component';
import { Party, Tile, LINE_LENGTH, LINE_HEIGHT, Coordinates, TileDistance, TargetColour, AiType, CharacterClass, Character } from './calculator.types';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  public myTeamKey = 'myTeam';
  public separatorImgSrc = `assets/grid_center.jpeg`;

  public bgControl = new FormControl(this.languageService.background);;
  public backgroundList$ = this.languageService.backgroundList$;

  public langList = languageList;
  public langControl = new FormControl(this.languageService.language);

  public showAllyLinesChecked = true;
  public showEnemyLinesChecked = true;
  public rememberMyTeam = this.localStorageService.get('rememberMyTeam');;
  
  public goodParty: Party;
  public evilParty: Party;
  // @TODO: good/evil summon party, like noxias pet
  
  public events: Array<string> = [];

  // Handle when user clicks on the tile - set/unset value, recalc stuff
  public onTileClick = (tile: Tile) => {
    const party = this.returnParty(tile.id);

    const tileIndexInParty = party.tiles.findIndex((member) => member?.id === tile.id);

    if (~tileIndexInParty) {
      party.tiles[tileIndexInParty] = {
        id: null,
        value: null,
        character: tile.character,
        positionInParty: tileIndexInParty
      };
      party.size = party.size - 1;
      const updatedTile: Tile = {
        ...tile,
        targets: null,
        summonTargets: null,
        character: null,
        positionInParty: null,
      }
      this.matrix[tile.id] = updatedTile;
      this.syncMyTeam();
      this.calculateEvents();
    } else if (party.size < 4) {
      const unusedIndex = party.tiles.findIndex((member) => !validTileId(member));
      const selectedCharacter = party.tiles[unusedIndex].character;

      (selectedCharacter ? of(selectedCharacter) : this.openHeroSelectDialog$()).subscribe((character) => {

        if (character) {
          party.size = party.size + 1;
          const updatedTile: Tile = {
            ...tile,
            positionInParty: unusedIndex,
            character,
          }
    
          party.tiles[unusedIndex] = updatedTile;
          this.matrix[updatedTile.id] = updatedTile;
          this.syncMyTeam();
          this.calculateEvents();
        }
      });
    }
  }

  public onChangeCharacter = (tile: Tile) => {
    this.openHeroSelectDialog$().subscribe((character) => {
      if (!character) {
        return;
      }
      const newTile: Tile = {
        ...tile,
        character
      }
      const party = this.returnParty(tile.id);
      party.tiles[newTile.positionInParty] = newTile;
      this.matrix[newTile.id] = newTile;
      this.syncMyTeam();
      this.calculateEvents();
    })
  }

  public generateMatrix = (): Array<Tile> => {
    return Array.from(new Array(LINE_LENGTH * LINE_HEIGHT), (_, i): Tile => {
      const posInLine = CalculatorComponent.returnPositionInLine(i);
      const baseTile: Tile = {
        value: '',
        onClick: this.onTileClick,
        onChangeCharacter: this.onChangeCharacter,
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

  constructor(
    private dialog: MatDialog,
    private languageService: LanguageService,
    private localStorageService: LocalStorageService,
    private characterService: CharacterService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log('init')
    this.reset();

    let shareLoaded = false;

    this.route.queryParamMap.forEach((param) => {
      console.log(param)
      if (param.has('share')) {
        const stringed = atob(param.get('share'));
        const [good, evil] = stringed.split(';');
        console.log(JSON.parse(good), JSON.parse(evil));
        this.goodParty = this.partyFromShare('Good', good, (party) => {
          this.goodParty = party;
          this.syncMyTeam();
        });
        this.evilParty = this.partyFromShare('Evil', evil, (party) => this.evilParty = party);
        this.matrix = [...this.matrix];
        this.calculateEvents();
        shareLoaded = true;
        console.log(stringed);
      }
    });

    if (!shareLoaded) {
      this.resetGoodParty(true);
      this.resetEvilParty();
    }


    this.langControl.valueChanges.subscribe((value) => {
      this.languageService.changeLang(value);
      this.goodParty = this.updatePartyCharNames(this.goodParty);
      this.evilParty = this.updatePartyCharNames(this.evilParty);
      this.calculateEvents();
    })

    this.bgControl.valueChanges.subscribe((value) => {
      this.languageService.changeBg(value);
    })
  }

  public reset() {
    this.matrix = this.generateMatrix();
  }

  public updatePartyCharNames(party: Party) {
    party = {...party}
    party.tiles = party.tiles.map((tile) => {
      const updatedTile = {
        ...tile,
        character: tile.character ? this.characterService.getCharacter(tile.character.id): null
      }
      if (validTileId(updatedTile)) {
        this.matrix[tile.id] = updatedTile;
      }
      return updatedTile;
    });
    return party;
  }

  public resetPartyTiles(oldParty: Party, newParty: Party) {
    oldParty?.tiles.forEach((tile) => {
      if (validTileId(tile)) {
        this.matrix[tile.id] = {
          value: '',
          onClick: this.onTileClick,
          onChangeCharacter: this.onChangeCharacter,
          id: tile.id
        }
      }
    });
  }

  public resetGoodParty(initial = false) {
    const oldParty = this.goodParty;
    if (initial) {
      let localPartyData = this.localStorageService.get<Party>(this.myTeamKey);
      if (localPartyData && localPartyData.tiles) {
        localPartyData.updateParty = (party) => {
          this.goodParty = party;
          this.syncMyTeam();
        }
        localPartyData = this.updatePartyCharNames(localPartyData);
        this.goodParty = localPartyData;
        return;
      }
    }
    this.goodParty = createParty('Good', (party) => {
      this.goodParty = party;
      this.syncMyTeam();
    });
    this.resetPartyTiles(oldParty, this.goodParty);
    this.syncMyTeam();
    this.calculateEvents();
  }

  public resetEvilParty() {
    const oldParty = this.evilParty;
    this.evilParty = createParty('Evil', (party) => this.evilParty = party);
    this.resetPartyTiles(oldParty, this.evilParty);
    this.calculateEvents();
  }

  public static returnPositionInLine(id: number): number {
    return (id % LINE_LENGTH) + 1;
  }

  public static returnPositionInColumn(id: number): number {
    return Math.floor((id) / LINE_LENGTH) + 1;
  }

  public returnParty(id: number): Party {
    const posInLine = CalculatorComponent.returnPositionInLine(id);
    if (posInLine < 5) {
      return this.goodParty;
    } else if (posInLine > 10) {
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

  private getTargets(attacker: Tile, attackerAi: AiType, attackers: Array<Tile>, defenders: Array<Tile>, alreadyInTarget: Array<Tile>) {
    let potentialTargets: Array<Tile> = [];
    // Melee targets closest, untargeted
    if (attackerAi === AiType.Melee) {
      potentialTargets = defenders.filter((m) => validTileId(m) && !alreadyInTarget.includes(m));
      // If all targets are taken occupied, just take closest one
      if (!potentialTargets.length) {
        potentialTargets = defenders.filter(validTileId);
      }
    // Ranged targets closest target
    } else if (attackerAi === AiType.Ranged) {
      potentialTargets = defenders.filter(validTileId);
    // Target furtherest friend
    } else if (attackerAi === AiType.Ally) {
      potentialTargets = attackers.filter((m) => validTileId(m) && attacker.id !== m.id);
    // 2 or MORE ranged - Attack closest untargeted ranged
    // 1 ranged - Attack that ranged
    // 0 ranged - melee AI fallback
    } else if (attackerAi === AiType.Assassin) {
      potentialTargets = defenders.filter((m) => validTileId(m) && m.character.class === CharacterClass.Ranged);
      if (potentialTargets.length > 1) {
        potentialTargets = potentialTargets.filter((m) => !alreadyInTarget.includes(m));
      }
    }
    return potentialTargets;
  }

  private calcTeamTarget(
    attackers: Array<Tile>,
    defenders: Array<Tile>,
    lineColour: TargetColour,
    targeted: Array<Tile>,
    summonMode: boolean = false,
  ) {
    const events: Array<string> = [];
    const targetedUpd = attackers.reduce((alreadyInTarget, attacker) => {
      if (summonMode) {
        attacker.summonTargets = null;
      } else {
        attacker.targets = null;
      }

      if (!validTileId(attacker) || (summonMode && !attacker.character.summonId)) {
        return alreadyInTarget;
      }

      const attackerCharacter: Character = summonMode ? this.characterService.getCharacter(attacker.character.summonId) : attacker.character;

      let usingAi: AiType = attackerCharacter.aiType;
      let potentialTargets: Array<Tile> = this.getTargets(
        attacker,
        usingAi,
        attackers,
        defenders,
        alreadyInTarget
      );

      if (!potentialTargets.length) {
        if (attackerCharacter.fallbackAiType) {
          usingAi = attackerCharacter.fallbackAiType;
          potentialTargets = this.getTargets(
            attacker,
            usingAi,
            attackers,
            defenders,
            alreadyInTarget
          );
        }
        if (!potentialTargets.length) {
          return alreadyInTarget;
        }
      }

      const attackerPos: Coordinates = {
        x: CalculatorComponent.returnPositionInLine(attacker.id),
        y: CalculatorComponent.returnPositionInColumn(attacker.id)
      }
      
      const target: TileDistance = potentialTargets.reduce((distanceArr, m) => {
        const defenderPos: Coordinates = {
          x: CalculatorComponent.returnPositionInLine(m.id),
          y: CalculatorComponent.returnPositionInColumn(m.id)
        }
        const distance = this.calcDistance(attackerPos, defenderPos);
        distanceArr.push({
          distance,
          tile: m
        });
        return distanceArr;
      }, [] as Array<TileDistance>).sort((a, b) => {
        if (usingAi === AiType.Ally) {
          return b.distance - a.distance
        }
        return a.distance - b.distance
      })[0];

      if (
        (lineColour === TargetColour.Ally && this.showAllyLinesChecked) ||
        (lineColour === TargetColour.Enemy && this.showEnemyLinesChecked)
      ) {
        if (summonMode) {
          attacker.summonTargets = target.tile;
          attacker.lineColour = lineColour;
        } else {
          attacker.targets = target.tile;
          attacker.lineColour = lineColour;
        }
      }

      let event: string;
      if (this.languageService.getLabel('attackTemplate', false)) {
        event = this.languageService.getLabel('attackTemplate')
          .replace('ATTACKER', attackerCharacter.name)
          .replace('TARGET', target.tile.character.name)
          .replace('RANGE', target.distance.toFixed(2));
      } else {
        event = `${attackerCharacter.name} ${this.languageService.getLabel('targets')} ${target.tile.character.name} ${this.languageService.getLabel('withDistance')} ${target.distance.toFixed(2)}`;
      }
      events.push(event);
      alreadyInTarget.push(target.tile);

      return alreadyInTarget;
    }, targeted);
    return {
      events,
      targeted: targetedUpd
    };
  }

  public calculateEvents() {
    if (!this.goodParty || !this.evilParty) {
      return;
    }
    const goodGuysResult = this.calcTeamTarget(this.goodParty.tiles, this.evilParty.tiles, TargetColour.Ally, []);
    const badGuysResult = this.calcTeamTarget(this.evilParty.tiles, this.goodParty.tiles, TargetColour.Enemy, goodGuysResult.targeted);

    const goodGuysSummonsResult = this.calcTeamTarget(this.goodParty.tiles, this.evilParty.tiles, TargetColour.Ally, badGuysResult.targeted, true);
    // @TODO: account for spawned good party summons when calculating enemy summon AI
    const badGuysSummonsResult = this.calcTeamTarget(this.evilParty.tiles, this.goodParty.tiles, TargetColour.Enemy, goodGuysSummonsResult.targeted, true);

    const newEvents = [
      ...goodGuysResult.events,
      ...badGuysResult.events,
      ...goodGuysSummonsResult.events,
      ...badGuysSummonsResult.events,
    ];
    this.events = newEvents;
    this.matrix = [...this.matrix];
    this.goodParty = {...this.goodParty};
    this.evilParty = {...this.evilParty};
  }

  public openHeroSelectDialog$(): Observable<Character> {
    const dialogRef = this.dialog.open(HeroSelectDialogComponent, {
      width: '700px',
      data: {}
    })
    return dialogRef.afterClosed();
  }

  public syncMyTeam(key: string = this.myTeamKey, team: Party = this.goodParty, forced = false) {
    if (!this.rememberMyTeam && !forced) {
      return;
    }
    let teamToSave: Party;
    if (team) {
      teamToSave = {
        ...team,
        updateParty: null,
        size: 0,
        tiles: team.tiles.map((tile) => {
          if (!tile) {
            return tile;
          } else {
            return {
              ...tile,
              id: null,
              lineColour: null,
              onChangeCharacter: null,
              targets: null,
              summonTargets: null,
              onClick: null,
            }
          }
        })
      }
    } else {
      teamToSave = null;
    }

    this.localStorageService.set<Party>(key, teamToSave);
  }

  public rememberMyTeamChecked() {
    this.localStorageService.set('rememberMyTeam', this.rememberMyTeam);
    if (this.rememberMyTeam) {
      this.syncMyTeam(this.myTeamKey, this.goodParty, true);
    } else {
      this.syncMyTeam(this.myTeamKey, null, true);
    }
  }

  public partyToShare(party: Party): string {
    const reduced = party.tiles.reduce((acc, e) => {
      if (e.character) {
        acc.push([e.id, e.character.id]);
      }
      return acc;
    }, []);
    return JSON.stringify(reduced);
  }

  // @TODO: fix party icon blinking
  // @TODO: fix party not updating
  // @TODO unify the update party method/restore from local storage method!
  public partyFromShare(name: string, stringParty: string, cb: Party['updateParty']): Party {
    const parsed: Array<Array<string>> = JSON.parse(stringParty);

    const party = createParty(name, cb);

    parsed.forEach(([id, char], i) => {
      let tile: Tile;
      let character: Character;
      if (char) {
        character = this.characterService.getCharacter(char);
      }
      if (id !== null && id !== undefined) {
        tile = this.matrix[id as unknown as number];
      } else {
        tile = party.tiles[i];
      }
      console.log('tile', tile, 'id', id)

      if (tile && character) {
        tile.character = character;
        party.size = party.size + 1;
      }
      party.tiles[i] = tile;
    });

    console.log('party', party)

    return party; 
  }

  public shareBtnClick() {
    const partyString = `${this.partyToShare(this.goodParty)};${this.partyToShare(this.evilParty)}`;
    console.log(partyString);
    const url = `${window.location.host}?share=${btoa(partyString)}`;
    this.dialog.open(ShareDialogComponent, {
      width: '700px',
      data: {
        url
      }
    })
  }

}
