import { inject, Injectable } from "@angular/core";
import { from, map, Observable, throwError } from "rxjs";
import { ApiService } from "../../api/api.service";

@Injectable({
    providedIn: 'root'
})
export class AnimeDetailsService {
    private readonly apiService = inject(ApiService)
    getAnimeBySlug(id: string | null): Promise<any> {
        if (!id) {
            throw new Error('id não fornecido');
        }

        return this.apiService.getV1(`kitsu-api/anime/${id}`, {})
    }
}