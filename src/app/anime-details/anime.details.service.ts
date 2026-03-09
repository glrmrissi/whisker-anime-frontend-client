import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../api/api.service";

@Injectable({
    providedIn: 'root'
})
export class AnimeDetailsService {
    private readonly apiService = inject(ApiService)
    getAnimeById(id: string | null): Promise<any> {
        if (!id) {
            throw new Error('id not found');
        }

        return this.apiService.getV1(`kitsu-api/anime/${id}?include=streamingLinks,genres`, {})
    }

    getAnimeEpisodes(id: string, limit = 20, offset = 0): Promise<any> {
        return this.apiService.getV1(
            `kitsu-api/anime/${id}/episodes?page[limit]=${limit}&page[offset]=${offset}`,
            {}
        );
    }

    getEpisodeById(episodeId: string): Promise<any> {
        return this.apiService.getV1(`kitsu-api/episodes/${episodeId}`, {});
    }

    getAnimeBasic(animeId: string): Promise<any> {
        return this.apiService.getV1(`kitsu-api/anime/${animeId}`, {});
    }

    getAdjacentEpisodes(animeId: string, episodeNumber: number): Promise<any> {
        const offset = Math.max(0, episodeNumber - 2);
        return this.apiService.getV1(
            `kitsu-api/anime/${animeId}/episodes?page[limit]=3&page[offset]=${offset}`,
            {}
        );
    }

}