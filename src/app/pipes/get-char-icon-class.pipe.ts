import { Pipe, PipeTransform } from "@angular/core";
import { ImgEvent } from "../attack-order/attack-order.component";
import { PartyTypes } from "../calculator/calculator.types";


@Pipe({
  name: 'getCharIconClass'
})
export class GetCharIconClassPipe implements PipeTransform {
  public transform(event: ImgEvent, attack: boolean) {
    return {
      'char-icon': true,
      'good-border': attack ? event.attackerSide === PartyTypes.good : event.defenderSide === PartyTypes.good,
      'evil-border': attack ? event.attackerSide === PartyTypes.evil : event.defenderSide === PartyTypes.evil
    }
  }
}
