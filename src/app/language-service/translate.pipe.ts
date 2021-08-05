import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from './language-service.service';
import { LabelKeys } from './traslations.data';

@Pipe({
  name: '_',
  pure: false
})
export class TranslatePipe implements PipeTransform {

  constructor(private languageService: LanguageService) {}

  transform(label: LabelKeys): string {
    return this.languageService.getLabel(label);
  }

}
