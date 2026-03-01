import { inject, Injectable } from "@angular/core";
import { from, Observable, of } from "rxjs";
import { ApiService } from "../../../../../src/api/api.service";

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private readonly _apiService = inject(ApiService);

    searchAnime(query: string): Observable<any> {
        if (!query.trim()) {
            return of({ data: [] });
        }

        return from(this._apiService.getV1(`kitsu-api/anime/search?title=${encodeURIComponent(query)}&limit=10`, {}));
    }
    
}