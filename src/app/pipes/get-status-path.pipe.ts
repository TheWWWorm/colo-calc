import { Pipe, PipeTransform } from "@angular/core";
import { ChainType } from "../calculator/calculator.types";

const base = '/assets/icons/'

const valueToPathName = {
  [ChainType.All]: base + 'all.png',
  [ChainType.Airborne]: base + 'airborne.png',
  [ChainType.Injured]: base + 'injured.png',
  [ChainType.Downed]: base + 'downed.png',
}

@Pipe({
  name: 'getStatusPath'
})
export class GetStatusPathPipe implements PipeTransform {
  public transform(chain: ChainType): string {
    return valueToPathName[chain];
  }
}
