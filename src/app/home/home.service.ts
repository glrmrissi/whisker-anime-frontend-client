import { Injectable } from "@angular/core";
import { ApiService } from "../../api/api.service";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
    constructor(
        private apiService: ApiService
    ) {}

    async getAnimeTrending() {
        return this.apiService.getV1('kitsu-api/trending-anime', { limit: '5' });
    }
}