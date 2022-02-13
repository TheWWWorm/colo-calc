import { Injectable } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay/overlay-ref'
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipViewComponent } from './rich-tooltip.component';
import { FlexibleConnectedPositionStrategy, Overlay } from '@angular/cdk/overlay';
import { Character } from '../calculator/calculator.types';
import { CharacterService } from '../character-service/character-service.service';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {
  private overlayRef: OverlayRef;
  private view: ComponentPortal<TooltipViewComponent>;

  constructor(
    private overlay: Overlay,
    private characterService: CharacterService,
  ) {
    this.overlayRef = this.overlay.create({
      panelClass: 'rich-tooltip-view'
    });
    this.view = new ComponentPortal(TooltipViewComponent);
  }

  public showTooltip(character: Character, summon: Character, pos: FlexibleConnectedPositionStrategy) {
    if (character) {
      this.overlayRef.detach();
      this.overlayRef.updatePositionStrategy(pos);
      const inst = this.overlayRef.attach(this.view).instance;
      inst.character = character;
      inst.summon = summon;
      inst.useJPArt = this.characterService.useJPArt;
      inst.init();
    }
  }

  public hideTooltip() {
    this.overlayRef.detach();
  }
}