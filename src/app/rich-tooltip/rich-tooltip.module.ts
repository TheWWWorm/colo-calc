import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PipesModule } from "../pipes/pipes.module";
import { TooltipViewComponent } from "./rich-tooltip.component";
import { RichTooltipDirective } from "./rich-tooltip.directive";

@NgModule({
  imports: [CommonModule, PipesModule],
  declarations: [TooltipViewComponent, RichTooltipDirective],
  exports: [RichTooltipDirective],
})
export class RichTooltipModule {};