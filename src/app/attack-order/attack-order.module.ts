import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttackOrderComponent } from './attack-order.component';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    PipesModule
  ],
  declarations: [AttackOrderComponent],
  exports: [AttackOrderComponent]
})
export class AttackOrderModule { }
