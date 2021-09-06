import { Pipe, PipeTransform } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { Background } from "../language-service/traslations.data";
import { map, startWith } from 'rxjs/operators';

const valueToClassName = {
  [Background.Solid]: 'bg-solid',
  [Background.Library]: 'bg-library',
  [Background.Lava]: 'bg-lava',
  [Background.Desert]: 'bg-desert',
  [Background.Dungeon]: 'bg-dungeon',
  [Background.Chess]: 'bg-chess',
  [Background.Training]: 'bg-training'
}

type ClassKey = keyof typeof valueToClassName;
type ReturnType = {
  [k in ClassKey]?: boolean
}

@Pipe({
  name: 'getBgClass'
})
export class GetBgClassPipe implements PipeTransform {
  public transform(control: FormControl): Observable<ReturnType> {
    return control.valueChanges.pipe(
      startWith(control.value),
      map((value: ClassKey) => {
        const code: ClassKey = (value as ClassKey)|| Background.Solid;
        console.log(code, valueToClassName[code]);
        return { [valueToClassName[code]]: true };
      })
    )
  }
}
