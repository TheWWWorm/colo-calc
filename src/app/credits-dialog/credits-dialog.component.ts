import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LabelKeys } from '../language-service/traslations.data';
import donators from './credits-donatorts.json';

export interface CreditsDialogData {}

@Component({
  templateUrl: './credits-dialog.component.html',
  styleUrls: ['./credits-dialog.component.scss']
})
export class CreditsDialogComponent {

  public authors: Array<LabelKeys> = [
    'creditsDialogDevelopThanksDescWorm',
    'creditsDialogDevelopThanksDesczMash',
    'creditsDialogDevelopThanksDescPoteto',
    'creditsDialogDevelopThanksDescHim157',
    'creditsDialogDevelopThanksDesXocatl',
    'creditsDialogDevelopThanksDescProcyon'
  ];
  public donators: Array<string> = donators;

  constructor(
    public dialogRef: MatDialogRef<CreditsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreditsDialogData,
  ) { }

  ngOnInit() {
  }

}
