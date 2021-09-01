import { Pipe, PipeTransform } from "@angular/core";
import { Character, Element } from "../calculator/calculator.types";

@Pipe({
  name: 'filterCharacters'
})
export class FilterCharactersPipe implements PipeTransform {
  public transform(charcters: Array<Character>, element: string): Array<Character> {
    return charcters.filter((charcter) => charcter.element === element);
  }
}
