import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../api/api.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogError } from "../../../projects/ui/src/lib/dialog-error/dialog-error";

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    constructor(
        private _apiService: ApiService
    ) { }   

    private _matDialog = inject(MatDialog);

    getUserProfile() {
        this._apiService.getV1('users/profile', {})
            .then(response => {
                // Snackbar 
            })
            .catch(error => {
                this._matDialog.open(DialogError, {
                    width: '30rem',
                    height: '30dvh',
                    data: { message: `Error fetching user profile: ${JSON.stringify(error)}` }
                });
            });
    }
}