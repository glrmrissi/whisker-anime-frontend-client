import { Injectable } from "@angular/core";
import { ApiService } from "../../../api/api.service";

@Injectable({
    providedIn: 'root'
})
export class ProfileAvatarService {
    constructor(private _apiService: ApiService) { }

    sendAvatarToServer(file: File) {
        const formData = new FormData();

        formData.append('file', file);

        this._apiService.postV1('users/upload-avatar', formData)
            .then(response => {
                console.log('Avatar uploaded successfully');
            })
            .catch(error => {
                console.error('Error uploading avatar:', error);
            });
    }
}