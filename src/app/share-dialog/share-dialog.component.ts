import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ShareDialogData {
  url: string;
}

@Component({
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss']
})
export class ShareDialogComponent implements AfterViewInit {

  public link = new FormControl(this.data.url);

  @ViewChild('shareLink') private linkElement: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ShareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShareDialogData,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.linkElement.nativeElement.select();
  }

}
