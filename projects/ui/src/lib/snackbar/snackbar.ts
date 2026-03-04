import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'app-snackbar',
    templateUrl: "./snackbar.html",
    styleUrl: './snackbar.css'
})  

export class SnackBar {
    @Input() message: string = 'Default';
    @Input() actionText: string = 'OK';

    @Output() action = new EventEmitter<void>();

    buttonClicked() {
        this.action.emit()
    }
}