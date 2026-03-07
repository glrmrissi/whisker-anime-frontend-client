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
        return this.apiService.getV1('favorites-animes', {});
    }

    async getRecommendations() {
        return this.apiService.getV1('recommendations', {});
    }

    getAnimeDiscovery(offset: number, limit: number, sort?: string, subtype?: string): Promise<any> {
        const params: Record<string, string | number> = {
            'page[limit]': limit,
            'page[offset]': offset,
        };
        if (sort) params['sort'] = sort;
        if (subtype) params['filter[subtype]'] = subtype.toLowerCase();
        return this.apiService.getV1('kitsu-api/anime', params);
    }
}