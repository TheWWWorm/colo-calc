import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyComponent } from './party.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PartyComponent],
  exports: [PartyComponent]
})
export class PartyModule { }
