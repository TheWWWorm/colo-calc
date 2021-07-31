import { Component, Input, OnInit } from '@angular/core';
import { Tile } from '../calculator/calculator.types';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  @Input() public matrix: Array<Tile> = [];

  constructor() { }

  ngOnInit() {
  }

}
