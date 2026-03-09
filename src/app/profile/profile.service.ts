import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../api/api.service";
import { SnackBarService } from "../../../projects/ui/src/public-api";

export type ProfileUpdateType = {
    bio?: string | null | undefined;
}

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private readonly snackBar = inject(SnackBarService);

    constructor(private _apiService: ApiService) { }

    async getUserProfile() {
        return await this._apiService.getV1('users/me', {});
    }

    async updateUserProfile(body: ProfileUpdateType) {
        try {
            this._apiService.patchV1('users/edit', {body});
            this.snackBar.open(
                "Updated profile succesfully",
                3000
            )
        } catch {
            this.snackBar.open(
                "An error occurred",
                3000
            )
        }
    }
}