import { Pipe, PipeTransform } from "@angular/core";
import { AiType, Character } from "../calculator/calculator.types";
import { LanguageService } from "../language-service/language-service.service";
import { LabelKeys } from "../language-service/traslations.data";

@Pipe({
  name: 'aiTypePipe'
})
export class AITypePipe implements PipeTransform {

  constructor(private languageService: LanguageService) {}

  public transform(character: Character): string {
    if (character.aiType === AiType.Assassin) {
      return `${this.languageService.getLabel(character.aiType)} ${this.languageService.getLabel('AI')}(${this.languageService.getLabel((character.assassinTarget + 'Class') as unknown as LabelKeys)}🎯)`;
    } else {
      return `${this.languageService.getLabel(character.aiType)} ${this.languageService.getLabel('AI')}`;
    }
  }
}
