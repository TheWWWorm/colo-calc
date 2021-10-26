import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Character, PartyTypes } from '../calculator/calculator.types';
import { CharacterService } from '../character-service/character-service.service';
import { LanguageService } from '../language-service/language-service.service';

export type TargetEvent = {
  attacker: Character;
  defender: Character;
  range: string;
  allyTarget: boolean;
  side: PartyTypes;
}

export type SimpleCharacter = {
  id: string;
  img: string;
  fallbackImg: string;
  side: PartyTypes;
  imgErrored?: () => void;
}

export type ImgEvent = {
  attackers: Array<SimpleCharacter>;
  defender: SimpleCharacter;
  targetingImg: string;
  range: string;
  attackerSide: PartyTypes;
  defenderSide: PartyTypes;
}

@Component({
  selector: 'app-attack-order',
  templateUrl: './attack-order.component.html',
  styleUrls: ['./attack-order.component.scss']
})
export class AttackOrderComponent implements OnChanges {

  @Input() textMode = true;
  @Input() events: Array<TargetEvent> = [];

  public textEvents: Array<string> = [];
  public imgEvents: Array<ImgEvent> = [];
  public allyImgEvents: Array<ImgEvent> = [];
  public enemyImgEvents: Array<ImgEvent> = [];

  constructor(
    private languageService: LanguageService,
    private characterService: CharacterService,
  ) { }
  
  // @TODO: show range
  // @TODO: nicer img look
  // @TODO: show in a max size box, use fit-content to resize things and max-values to keep things sane
  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes!');
    if (this.textMode) {
      this.textEvents = this.events.map((event) => this.toStringEvent(event));
    } else {
      this.toImgEvents(this.events);
    }
  }

  public toStringEvent(event: TargetEvent): string {
    const { attacker, defender, range } = event;
    if (this.languageService.getLabel('attackTemplate', false)) {
      return this.languageService.getLabel('attackTemplate')
        .replace('ATTACKER', attacker.name)
        .replace('TARGET', defender.name)
        .replace('RANGE', range);
    }
    return `${attacker.name} ${this.languageService.getLabel('targets')} ${defender.name} ${this.languageService.getLabel('withDistance')} ${range}`;
  }

  public toImgEvents(events: Array<TargetEvent>) {
    const allyEvents: Array<ImgEvent> = [];
    const enemyEvents: Array<ImgEvent> = [];
    events.forEach((event: TargetEvent) => {
      const { attacker, defender, range, allyTarget, side } = event;
      const targetSide = allyTarget ?
            side :
            side === PartyTypes.evil ? PartyTypes.good : PartyTypes.evil
      let affectedArray = targetSide === PartyTypes.good ?
        allyTarget ? enemyEvents : allyEvents :
        allyTarget ? allyEvents : enemyEvents  ;
      let editedEvent: ImgEvent = affectedArray.find((imgEvent) => {
        return imgEvent.defender.id === event.defender.id;
      })
      if (editedEvent) {
        editedEvent.attackers.push(this.toSimpleCharacter(attacker, side));
      } else {
        editedEvent = {
          attackerSide: side,
          defenderSide: targetSide,
          attackers: [this.toSimpleCharacter(attacker, side)],
          defender: this.toSimpleCharacter(defender, targetSide),
          range,
          targetingImg: allyTarget ? '/assets/icons/staff.png' : '/assets/icons/sword_1.png'
        }
        affectedArray.push(editedEvent);
      }      
    });
    this.allyImgEvents = allyEvents;
    this.enemyImgEvents = enemyEvents;
    this.imgEvents = [...enemyEvents, ...allyEvents];
  }

  public toSimpleCharacter(char: Character, side: PartyTypes): SimpleCharacter {
    const useJPArt = this.characterService.useJPArt;
    const simpleChar: SimpleCharacter = {
      id: char.id,
      img: useJPArt ? char.jpImgName : char.imgName,
      fallbackImg: char.imgName,
      side,
    }
    simpleChar.imgErrored = () => {
      simpleChar.img = simpleChar.fallbackImg;
    };
    return simpleChar;
  }
}
