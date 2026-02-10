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

    async getAnimePagination(page: string = '1', limit: string = '10', nsfw: string = 'true') {
        return this.apiService.getV1(`kitsu-api/anime?page=${page}&limit=${limit}&nsfw=${nsfw}`, {});
    }

    async getFavoriteAnimes() {
        const res = this.apiService.getV1('favorites-animes', {});
        console.log('Favorite animes response:', res);
        return res;
    }
}