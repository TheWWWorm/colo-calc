import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NEVER, of } from 'rxjs';
import { Observable } from 'rxjs';
import { switchMap, switchMapTo } from 'rxjs/operators';
import { createParty, validTileId } from 'src/fn/helpers';
import { CharacterService } from '../character-service/character-service.service';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';
import { HeroSelectDialogComponent } from '../hero-select-dialog/hero-select-dialog.component';
import { LanguageService } from '../language-service/language-service.service';
import { languageList } from '../language-service/traslations.data';
import { LocalStorageService } from '../local-storage-service/local-storage-service.service';
import { ShareDialogComponent } from '../share-dialog/share-dialog.component';
import { Party, Tile, LINE_LENGTH, LINE_HEIGHT, Coordinates, TileDistance, TargetColour, AiType, CharacterClass, Character, dialogWidth } from './calculator.types';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit, OnDestroy {
  public clearParams = true;

  public shareIconName = /(Mac|iPhone|iPod|iPad)/i.test(navigator?.platform || '') ? 'ios_share' : 'share';
  public myTeamKey = 'myTeam';
  public separatorImgSrc = `assets/grid_center.jpeg`;

  public bgControl = new FormControl(this.languageService.background);;
  public backgroundList$ = this.languageService.backgroundList$;

  public langList = languageList;
  public langControl = new FormControl(this.languageService.language);

  public showAllyLinesChecked = true;
  public showEnemyLinesChecked = true;
  public showAttackOrder = this.localStorageService.get('showAttackOrder');
  public useJPArt = this.characterService.useJPArt;
  public rememberMyTeam = this.localStorageService.get('rememberMyTeam');
  
  public goodParty: Party;
  public evilParty: Party;
  
  public events: Array<string> = [];

  private interval: any;

  // Handle when user clicks on the tile - set/unset value, recalc stuff
  public onTileClick = (tile: Tile) => {
    const party = this.returnParty(tile.id);
    const partySize = party.tiles.filter((tile) => tile.character && validTileId(tile)).length;

    const tileIndexInParty = party.tiles.findIndex((partyTile) => partyTile?.id === tile.id);

    if (~tileIndexInParty) {
      party.tiles[tileIndexInParty] = {
        id: null,
        value: null,
        character: tile.character,
        positionInParty: tileIndexInParty
      };
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
    } else if (partySize < 4  ) {
      const unusedIndex = party.tiles.findIndex((member) => !validTileId(member));
      const selectedCharacter = party.tiles[unusedIndex].character;

      if (selectedCharacter) {
        const updatedTile: Tile = {
          ...tile,
          positionInParty: unusedIndex,
          character: selectedCharacter,
        }
  
        party.tiles[unusedIndex] = updatedTile;
        this.matrix[updatedTile.id] = updatedTile;
        this.syncMyTeam();
        this.calculateEvents();
      } else {
        this.openHeroSelectDialog(party, unusedIndex, tile)
      }
    }
  }

  public onChangeCharacter = (tile: Tile) => {
    const party = this.returnParty(tile.id);
    this.openHeroSelectDialog(party, tile.positionInParty, tile);
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
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    console.log('init')
    this.matrix = this.generateMatrix();

    let goodPartyString: string = this.localStorageService.getUnparsed(this.myTeamKey);;
    let evilPartyString: string;

    this.route.queryParamMap.forEach((param) => {
      if (param.has('share')) {
        try {
          const stringed = atob(param.get('share'));
          const partyData = stringed.split(';');
          goodPartyString = partyData[0];
          evilPartyString = partyData[1]; 
        } catch (error) {
          console.error('Errored trying to work with share param!', error)
        }

        if (this.clearParams) {
          window.history.pushState({}, document.title, window.location.pathname);
          this.rememberMyTeam = false;
        }
      }
    });

    this.resetParty(
      'Good',
      'goodParty',
      goodPartyString
    );
    this.resetParty('Evil', 'evilParty', evilPartyString);
    this.matrix = [...this.matrix];
    this.calculateEvents();


    this.langControl.valueChanges.subscribe((value) => {
      this.languageService.changeLang(value);
      this.goodParty = this.updatePartyCharNames(this.goodParty);
      this.evilParty = this.updatePartyCharNames(this.evilParty);
      this.calculateEvents();
    })

    this.bgControl.valueChanges.subscribe((value) => {
      this.languageService.changeBg(value);
    });

    if (this.showAttackOrder === null) {
      this.showAttackOrder = true;
      this.showAttackOrderClick();
    } 

    // Hacky stuff, to fix lines
    let timeout: any;

    const setRecalc =() => {
      if (timeout) {
        return;
      }
      timeout = setTimeout(() => {
        console.log('call')
        this.matrix = [...this.matrix];
        this.calculateEvents();
        timeout = null;
      }, 500);
    }

    (() => {
      // Poll the pixel width of the window; invoke zoom listeners
      // if the width has been changed.
      var lastWidth = visualViewport.width;
      const pollZoomFireEvent = () => {
        var widthNow = visualViewport.width;
        if (lastWidth == widthNow) {
          return;
        };
        lastWidth = widthNow;
        setRecalc();
      }
      setInterval(pollZoomFireEvent, 500);
    })();
  }

  public ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
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
    defenders = defenders.filter((m) => validTileId(m) && m?.character)
    // Melee targets closest, untargeted
    if (attackerAi === AiType.Melee) {
      potentialTargets = defenders.filter((m) => !alreadyInTarget.includes(m));
      // If all targets are taken occupied, just take closest one
      if (!potentialTargets.length) {
        potentialTargets = defenders;
      }
    // Ranged targets closest target
    } else if (attackerAi === AiType.Ranged) {
      potentialTargets = defenders;
    // Target furtherest friend
    } else if (attackerAi === AiType.Ally) {
      potentialTargets = attackers.filter((m) => attacker.id !== m.id);
    // 2 or MORE ranged - Attack closest untargeted ranged
    // 1 ranged - Attack that ranged
    // 0 ranged - melee AI fallback
    } else if (attackerAi === AiType.Assassin) {
      potentialTargets = defenders.filter((m) => m.character.class === CharacterClass.Ranged);
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

      if (!validTileId(attacker) || (summonMode && !attacker.character?.summonId) || !attacker.character) {
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
        (
          (
            lineColour === TargetColour.Ally ||
            lineColour === TargetColour.AllySummon
          ) && this.showAllyLinesChecked
        ) ||
        (
          (
            lineColour === TargetColour.Enemy ||
            lineColour === TargetColour.EnemySummon
          ) && this.showEnemyLinesChecked
        )
      ) {
        if (summonMode) {
          attacker.summonTargets = target.tile;
          attacker.summonLineColour = lineColour;
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

    const goodGuysSummonsResult = this.calcTeamTarget(this.goodParty.tiles, this.evilParty.tiles, TargetColour.AllySummon, badGuysResult.targeted, true);
    // @TODO: account for spawned good party summons when calculating enemy summon AI
    const badGuysSummonsResult = this.calcTeamTarget(this.evilParty.tiles, this.goodParty.tiles, TargetColour.EnemySummon, goodGuysSummonsResult.targeted, true);

    const newEvents = [
      ...goodGuysResult.events,
      ...badGuysResult.events,
      ...goodGuysSummonsResult.events,
      ...badGuysSummonsResult.events,
    ];
    if (this.showAttackOrder) {
      this.events = newEvents;
    }
    this.matrix = [...this.matrix];
    this.goodParty = {...this.goodParty};
    this.evilParty = {...this.evilParty};
  }

  public openHeroSelectDialog(party: Party, i: number, tile?: Tile)  {
    this.dialog.open(HeroSelectDialogComponent, {
      width: dialogWidth,
      data: {
        party,
        index: i,
        tile
      }
    });
  }

  public syncMyTeam(key: string = this.myTeamKey, team: Party = this.goodParty, forced = false) {
    if (!this.rememberMyTeam && !forced) {
      return;
    }

    let teamToSave = this.partyToShare(team);
    this.localStorageService.set(key, teamToSave);
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
      const id = e?.id !== undefined && e?.id !== null ? e?.id : null;
      const characterId = e.character?.id || null;
      acc.push([id, characterId]);
      return acc;
    }, []);
    return JSON.stringify(reduced);
  }

  // @TODO: fix party icon blinking
  // @ALSO refactor this component. try to remove saving options. Also, use the method bellow to store the data to "save my party" option.
  // Consider "party" class!
  public resetParty(
    partyName: string,
    partyKey: 'evilParty' | 'goodParty',
    partyString?: string
  ) {
    const party = createParty(partyName, (party) => {
      this[partyKey] = {
        ...party,
        tiles: [...party.tiles],
      };
      this.syncMatrixToTeams();
      this.calculateEvents();
      this.syncMyTeam();
      console.log(this[partyKey]);
    });

    if (partyString) {
      try {
        const parsed: Array<Array<string>> = JSON.parse(partyString);
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
          
          tile.character = character;
          tile.positionInParty = i;
          party.tiles[i] = tile;
        });
      } catch (error) {
        console.log('Errored working with partyString:', partyString, error)
      }
    }

    const oldParty = this[partyKey];
    this[partyKey] = party;
    this.resetPartyTiles(oldParty, this[partyKey]);
    this.syncMyTeam();
    this.calculateEvents();
  }

  public shareBtnClick() {
    const partyString = `${this.partyToShare(this.goodParty)};${this.partyToShare(this.evilParty)}`;
    const url = `${window.location.origin}?share=${btoa(partyString)}`;
    this.dialog.open(ShareDialogComponent, {
      width: dialogWidth,
      data: {
        url
      }
    })
  }

  public helpBtnClick() {    
    this.dialog.open(HelpDialogComponent, {
      width: dialogWidth,
      data: {}
    })
  }

  public useJPArtClick() {
    this.characterService.updateArtChoice(this.useJPArt);
    this.goodParty = this.updatePartyCharNames(this.goodParty);
    this.evilParty = this.updatePartyCharNames(this.evilParty);
    this.matrix = [...this.matrix]
  }

  public showAttackOrderClick() {
    this.localStorageService.set('showAttackOrder', this.showAttackOrder);
    if (this.showAttackOrder) {
      this.calculateEvents();
    } else {
      this.events = [];
    }
  }

  public syncParty(party: Party, matrix: Array<Tile>) {
    party.tiles.forEach((tile) => {
      if (validTileId(tile)) {
        matrix[tile.id] = tile;
      }
    });
  }

  public syncMatrixToTeams() {
    const matrix = this.matrix.map((tile) => {
      return {
        ...tile,
        character: null,
        positionInParty: null,
        targets: null,
        summonTargets: null,
      }
    });
    this.syncParty(this.goodParty, matrix);
    this.syncParty(this.evilParty, matrix);
    this.matrix = matrix;
  }
}
