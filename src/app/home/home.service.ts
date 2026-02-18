import { Injectable } from "@angular/core";
import { ApiService } from "../../api/api.service";

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    constructor(
        private apiService: ApiService
    ) { }

    async getAnimeTrending() {
        return this.apiService.getV1('kitsu-api/trending-anime', { limit: '10' });
    }

    async getAnimePagination(page: string, limit: string, sort: string, subtype: string) {
        return this.apiService.getV1(`kitsu-api/anime?page=${page}&limit=${limit}&sort=${sort}&subtype=${subtype}`, {});
    }

    async getFavoriteAnimes() {
        const res = this.apiService.getV1('favorites-animes', {});
        console.log('Favorite animes response:', res);
        return res;
    }
}