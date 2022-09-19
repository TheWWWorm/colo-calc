import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttackOrderComponent } from './attack-order.component';
import { PipesModule } from '../pipes/pipes.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    FormsModule
  ],
  declarations: [AttackOrderComponent],
  exports: [AttackOrderComponent]
})
export class AttackOrderModule { }
