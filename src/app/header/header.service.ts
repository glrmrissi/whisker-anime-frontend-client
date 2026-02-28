import { Injectable } from "@angular/core";
import { ApiService } from "../../api/api.service";

@Injectable({
    providedIn: 'root'
})
export class HeaderService {
    constructor(
        private readonly apiService: ApiService
    ) {}

    async getUserProfile() {
        return await this.apiService.getV1('users/avatar', {})
    }
}