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

  public infinityCheck(num: number): number {
    if (isFinite(num)) {
      return num;
    }
    return 1;
  }

  public createLine(
    id_from: string,
    id_to: string,
    color: TargetColour,
    summonMode: boolean = false
  ) {
    const id = `line_container_${id_from}_${id_to}${summonMode ? '_summon' : ''}`;
    const pahtSubId = `line_${id_from}_${id_to}${summonMode ? '_summon' : ''}`;
    const arrowSubId = `arrow_line_${id_from}_${id_to}${summonMode ? '_summon' : ''}`;
    this.lines.push(id);
    //SVG that will not appear until points towards the element that we want is given
    const create_svg = `<span id="${id}" style="position: absolute; pointer-events: none; top: 0; left: 0; z-index: 10"> <svg width="700" height="300" style="overflow: visible;">    <defs>    <marker id="${arrowSubId}" markerWidth="13" markerHeight="13" refx="2" refy="6" orient="auto">        <path d="M2,1 L2,10 L10,6 L2,2" style="fill:${color};" />      </marker>    </defs>    <path id="${pahtSubId}" d="" style="stroke:${color}; stroke-width: 3px; fill: none; marker-end: url(#${arrowSubId});"/>  </svg> </span>`;

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
    // @TODO: better targeting for ally units
    const rangeX = Math.abs(from.x - to.x);
    if (rangeX > 300) {
      if (from.x < to.x) {
        to.x = to.x - test2_loc.width;
        from.x = from.x + test1_loc.width / 2;
      } else if (to.x < from.x) {
        to.x = to.x + test2_loc.width;
        from.x = from.x - test1_loc.width /2;
      }

      if (from.y === to.y && !summonMode) {
        if (color === TargetColour.Ally) {
          from.y = from.y - 5;
          to.y = to.y - 5;
        }
        if (color === TargetColour.Enemy) {
          from.y = from.y + 5;
          to.y = to.y + 5;
        } 
      } else if (from.y !== to.y && !summonMode) {
        from.y = from.y + 10;
        to.y = to.y + 10;
      }
    } else {

      const mod = 10;

      const offsetX = test2_loc.width;
      const offsetY = test2_loc.height;

      const signX = from.x > to.x ? 1 : -1
      const signY = from.y > to.y ? 1 : -1

      const xDiff = Math.abs((from.x - to.x) / offsetX);
      const yDiff = Math.abs((from.y - to.y) / offsetY);

      if (xDiff) {
        to.x = to.x + (signX * (offsetX - (yDiff * mod)));

      }
      if (yDiff) {
        to.y = to.y + (signY * (offsetY - (xDiff * mod)));
      }
      
    }
    const coords = (
      'M' + from.x
      + ',' + from.y + 
       ' L' + to.x +
      ',' + to.y
    );
    //Input into SVG
    //(test1_loc, test2_loc, coords);
    document.getElementById(pahtSubId).setAttribute('d', coords);
  }


}
