import { Injectable } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay/overlay-ref'
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipViewComponent } from './rich-tooltip.component';
import { FlexibleConnectedPositionStrategy, Overlay } from '@angular/cdk/overlay';
import { Character } from '../calculator/calculator.types';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {
  private overlayRef: OverlayRef;
  private view: ComponentPortal<TooltipViewComponent>;

  constructor(private overlay: Overlay) {
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
    }
  }

  public hideTooltip() {
    this.overlayRef.detach();
  }
}