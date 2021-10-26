import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
  name: 'getCharIconStyle'
})
export class GetCharIconStylePipe implements PipeTransform {
  public transform(index: number, length: number) {
    const zIndex = length - index;
    return `z-index: ${zIndex};`
  }
}
