import { Injectable } from "@angular/core";
import { ApiService } from "../../../api/api.service";

export interface HistoryItem {
  id: number;
  userId: string;
  action: string;
  animeId: number | null;
  episodeId: number | null;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  constructor(private _apiService: ApiService) {}

  getHistory(page = 1): Promise<HistoryItem[]> {
    return this._apiService.getV1<HistoryItem[]>('history', { page });
  }
}
