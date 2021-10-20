import { Component, Input } from "@angular/core";
import { AiType, Character } from "../calculator/calculator.types";

@Component({
  selector: 'rich-tooltip-view',
  templateUrl: './rich-tooltip.component.html',
  styleUrls: ['./rich-tooltip.component.scss']
})
export class TooltipViewComponent{
  @Input() character: Character;
  @Input() summon: Character;
  @Input() useJPArt: boolean;

  public artSrc: string;

  public init() {
    if (!this.character) {
      return;
    }
    this.artSrc = this.useJPArt ? this.character.jpImgName : this.character.imgName;
  }

  public imgErrored() {
    this.artSrc = this.character.imgName;
  }
}