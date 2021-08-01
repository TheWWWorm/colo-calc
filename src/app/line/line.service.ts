import { Injectable } from '@angular/core';
import { Coordinates, TargetColour } from '../calculator/calculator.types';

function parseHTML(html: string) {
  const t = document.createElement('template');
  t.innerHTML = html;
  return t.content;
}

@Injectable({
  providedIn: 'root'
})
export class LineService {

  public lines: Array<string> = [];

  constructor() { }

  public clearLines() {
    this.lines.forEach((id) => {
      document.getElementById(id)?.remove();
    })
  }

  public createLine(id_from: string, id_to: string, color: TargetColour) {
    const id = `line_container_${id_from}_${id_to}`;
    const subId = `line_${id_from}_${id_to}`;
    this.lines.push(id);
    //SVG that will not appear until points towards the element that we want is given
    const create_svg = `<span id="${id}" style="position: absolute; pointer-events: none; top: 0; left: 0;"> <svg width="1000" height="1000" >    <defs>    <marker id="arrow" markerWidth="13" markerHeight="13" refx="2" refy="6" orient="auto">        <path d="M2,1 L2,10 L10,6 L2,2" style="fill:${color};" />      </marker>    </defs>    <path id="${subId}" d="" style="stroke:${color}; stroke-width: 1.75px; fill: none; marker-end: url(#arrow);"/>  </svg> </span>`;

    const parsed = parseHTML(create_svg);
    document.querySelector("#" + id_from).before(parsed);

    //Give the locations of the two elements
    const test1 = document.getElementById(id_from);
    const test2 = document.getElementById(id_to);
    const test1_loc = test1.getBoundingClientRect();
    const test2_loc = test2.getBoundingClientRect();
    const windowLoc = document.body.getBoundingClientRect();
    const modifier = 20;
    const from: Coordinates = {
      x: test1_loc.x + modifier - windowLoc.x,
      y: test1_loc.y + modifier - windowLoc.y
    }
    const to: Coordinates = {
      x: test2_loc.x + modifier - windowLoc.x,
      y: test2_loc.y + modifier - windowLoc.y
    }
    const coords = (
      'M' + from.x
      + ',' + from.y + 
       ' L' + to.x +
      ',' + to.y
    );
    //Input into SVG
    console.log(test1_loc, test2_loc, coords);
    document.getElementById(subId).setAttribute('d', coords);
  }


}
