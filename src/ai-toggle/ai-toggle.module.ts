import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiToggleComponent } from './ai-toggle.component';
import { FormsModule } from '@angular/forms';
import { ValidTileIdPipe } from './valid-tile-id.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [AiToggleComponent, ValidTileIdPipe],
  exports: [AiToggleComponent, ValidTileIdPipe],
  providers: []
})
export class AiToggleModule { }
