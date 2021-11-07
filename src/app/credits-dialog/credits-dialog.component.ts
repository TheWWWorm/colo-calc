import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LabelKeys } from '../language-service/traslations.data';
import { LocalStorageService } from '../local-storage-service/local-storage-service.service';
import donators from './credits-donatorts.json';

export interface CreditsDialogData {
  updateField: () => void;
}

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

  public kangClicked = false;

  constructor(
    public dialogRef: MatDialogRef<CreditsDialogComponent>,
    private localStorageService: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: CreditsDialogData,
  ) { }

  ngOnInit() {
  }

  public toggleKangMode() {
    this.kangClicked = true;
    this.localStorageService.set('kangMode', !this.localStorageService.get('kangMode'));
    this.data.updateField();
  }

}
