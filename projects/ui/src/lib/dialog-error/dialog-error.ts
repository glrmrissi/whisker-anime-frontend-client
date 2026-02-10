
import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';

export const DialogData = {
  message: '',
};

@Component({
    selector: 'lib-dialog-error',
    imports: [FaIconComponent],
    templateUrl: './dialog-error.html',
    styleUrls: ['./dialog-error.css'],
})

    export class DialogError {
    readonly dialogRef = inject(MatDialogRef<DialogError>)
    protected data: any = inject(MAT_DIALOG_DATA);
    protected faWarning = faWarning;

    message: string = inject(MAT_DIALOG_DATA).message;

    closeDialog(): void {
        this.dialogRef.close();
    }
}