import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faHeart, faCompass } from '@fortawesome/free-solid-svg-icons';
import { Header } from '../header/header';
import { FavoritesGrid, FavoriteItem } from './favorites-grid';
import { FavoritesService } from './favorites.service';
import { AnimeDetailsService } from '../anime-details/anime.details.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [Header, FavoritesGrid, FaIconComponent, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites implements OnInit {
  private favoritesService = inject(FavoritesService);
  private animeDetailsService = inject(AnimeDetailsService);

  protected items = signal<FavoriteItem[]>([]);
  protected isLoading = signal(true);

  protected faHeart = faHeart;
  protected faCompass = faCompass;

  async ngOnInit(): Promise<void> {
    try {
      const ids = await this.favoritesService.getIds();

      if (ids.length === 0) return;

      const results = await Promise.all(
        ids.map(id =>
          this.animeDetailsService.getAnimeById(String(id)).catch(() => null)
        )
      );

      const mapped: FavoriteItem[] = results
        .filter(Boolean)
        .map(res => ({
          id: res.data.id,
          coverImage: res.data.attributes.posterImage?.large || '',
          canonicalTitle: res.data.attributes.canonicalTitle || '',
          subtype: [res.data.attributes.subtype || '']
        }));

      this.items.set(mapped);
    } finally {
      this.isLoading.set(false);
    }
  }
}
