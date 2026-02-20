import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../api/api.service";

@Injectable({
    providedIn: 'root'
})
export class AnimeDetailsService {
    private readonly apiService = inject(ApiService)
    getAnimeById(id: string | null): Promise<any> {
        if (!id) {
            throw new Error('id não fornecido');
        }

        return this.apiService.getV1(`kitsu-api/anime/${id}?include=streamingLinks,genres`, {})
    }

}