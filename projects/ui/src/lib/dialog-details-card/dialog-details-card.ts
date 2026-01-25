import { Component, inject, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export const DialogData = {
  id: '',
};

@Component({
  selector: 'lib-dialog-details-card',
  imports: [],
  templateUrl: './dialog-details-card.html',
  styleUrl: './dialog-details-card.css',
})
// TODO: MAKE THIS SHIT WORK

export class DialogDetailsCard implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DialogDetailsCard>);
  data: any = inject(MAT_DIALOG_DATA);

  ngOnInit() {
    console.log(this.data);
  }
  
  close(): void {
    this.dialogRef.close();
  }
}