import { FlexibleConnectedPositionStrategy, Overlay } from "@angular/cdk/overlay";
import { Directive, ElementRef, HostListener, Input } from "@angular/core";
import { Character } from "../calculator/calculator.types";
import { TooltipService } from "./rich-tooltip.service";

@Directive({
  selector: '[richTooltip]',
})
export class RichTooltipDirective {
  @Input() public character: Character;
  @Input() public summon: Character;

  private timeout: ReturnType<typeof setTimeout>;
  private readonly pos: FlexibleConnectedPositionStrategy;

  constructor(private el: ElementRef, private overlay: Overlay, private tooltipService: TooltipService) {
    const pos = this.overlay.position().flexibleConnectedTo(this.el);
    pos.withPositions([
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
        offsetY: -13
      },
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: 15
      },
    ]);
    this.pos = pos;
  }

  @HostListener('mouseenter') public onMouseEnter() {
    this.timeout = setTimeout(() => {
      this.tooltipService.showTooltip(this.character, this.summon, this.pos);
      this.timeout = null;
    }, 500)

    const interval = setInterval(() => {
      if (!document.body.contains(this.el.nativeElement)) {
        this.clearTooltip();
        clearInterval(interval);
      }
    }, 300)
  }

  @HostListener('mouseleave') public onMouseLeave() {
    this.clearTooltip();
  }

  @HostListener('click') public onCLick() {
    this.clearTooltip();
  }

  private clearTooltip() {
    this.tooltipService.hideTooltip();
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}