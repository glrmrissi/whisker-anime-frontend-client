import { Injectable } from "@angular/core";
import { ApiService } from "../../../api/api.service";

@Injectable({
    providedIn: 'root'
})
export class ProfileAvatarService {
    constructor(private _apiService: ApiService) { }

    async sendAvatarToServer(file: File) {
        const formData = new FormData();

        formData.append('file', file);

        await this._apiService.postV1('users/upload-avatar', formData)
            .then(response => {
                return response.avatarUrl;
            })
            .catch(error => {
                console.error('Error uploading avatar:', error);
                return;
            });
    }
}