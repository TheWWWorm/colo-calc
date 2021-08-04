import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiToggleComponent } from './ai-toggle.component';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule
  ],
  declarations: [AiToggleComponent],
  exports: [AiToggleComponent],
  providers: []
})
export class AiToggleModule { }
