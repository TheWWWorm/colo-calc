import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Character } from '../calculator/calculator.types';
import { CharacterService } from '../character-service/character-service.service';
import { LanguageService } from '../language-service/language-service.service';

export type TargetEvent = {
  attacker: Character;
  defender: Character;
  range: string;
  allyTarget: boolean;
}

export type ImgEvent = {
  attackerImg: string;
  defenderImg: string;
  attackerFallbackImg: string;
  defenderFallbackImg: string
  targetingImg: string;
  range: string;
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

  constructor(
    private languageService: LanguageService,
    private characterService: CharacterService,
  ) { }
  
  // @TODO: show range
  // @TODO: show by team attack order
  // @TODO: nicer img look
  ngOnChanges(changes: SimpleChanges): void {
    if (this.textMode) {
      this.textEvents = this.events.map((event) => this.toStringEvent(event));
    } else {
      this.imgEvents = this.events.map((event) => this.toImgEvent(event));
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

  public toImgEvent(event: TargetEvent): ImgEvent {
    const { attacker, defender, range, allyTarget } = event;
    const useJPArt = this.characterService.useJPArt;
    return {
      attackerImg: useJPArt ? attacker.jpImgName : attacker.imgName,
      defenderImg: useJPArt ? defender.jpImgName : defender.imgName,
      attackerFallbackImg: attacker.imgName,
      defenderFallbackImg: defender.imgName,
      targetingImg: allyTarget ? '/assets/icons/staff.png' : '/assets/icons/sword_1.png',
      range,
    }
  }

  public imgErrored(event: ImgEvent, key: 'attackerImg' | 'defenderImg', fallback: string) {
    event[key] = fallback;
  }

}
