import { Injectable } from "@angular/core";
import { ApiService } from "../../api/api.service";

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    constructor(
        private _apiService: ApiService
    ) { }   

    async getUserProfile() {
        return await this._apiService.getV1('users', {})
    }
}