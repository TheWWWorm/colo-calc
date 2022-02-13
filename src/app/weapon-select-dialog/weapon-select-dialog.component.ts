import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Weapon } from '../calculator/calculator.types';
import { CharacterService } from '../character-service/character-service.service';

export interface WeaponSelectDialogData {
  weapons: Array<string>
}

@Component({
  templateUrl: './weapon-select-dialog.component.html',
  styleUrls: ['./weapon-select-dialog.component.scss']
})
export class WeaponSelectDialogComponent {

  public weapons: Array<Weapon>;

  constructor(
    public dialogRef: MatDialogRef<WeaponSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WeaponSelectDialogData,
    private characterService: CharacterService,
  ) {
    this.weapons = data.weapons.map((weaponId) => this.characterService.getWeapon(weaponId));
  }

  public weaponSelected(weapon: Weapon): void {
    this.dialogRef.close(weapon);
  }
}
