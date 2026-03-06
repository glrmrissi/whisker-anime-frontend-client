import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '../../api/api.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private api = inject(ApiService);

  private readonly _ids = signal<Set<number>>(new Set());
  private readonly _loaded = signal(false);
  private _loadingPromise: Promise<void> | null = null;

  readonly ids = this._ids.asReadonly();
  readonly loaded = this._loaded.asReadonly();

  async load(): Promise<void> {
    if (this._loaded()) return;
    if (this._loadingPromise) return this._loadingPromise;

    this._loadingPromise = this.api.getV1('favorites-animes', {})
      .then((items: { animeId: number }[]) => {
        this._ids.set(new Set(items.map(f => Number(f.animeId))));
      })
      .catch(() => {})
      .finally(() => {
        this._loaded.set(true);
        this._loadingPromise = null;
      });

    return this._loadingPromise;
  }

  async add(animeId: number): Promise<void> {
    if (this._ids().has(animeId)) return;

    await this.api.postV1(`favorites-animes/${animeId}`, {});
    this._ids.update(prev => new Set([...prev, animeId]));
  }

  async getIds(): Promise<number[]> {
    await this.load();
    return Array.from(this._ids());
  }
}
