import { ActivatedRoute } from '@angular/router';
import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AnimeDetailsService } from './anime.details.service';
import { Header } from '../header/header';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Title } from '@angular/platform-browser';
import { Comments } from '../comments/comments';
import { FavoritesService } from '../favorites/favorites.service';
import { SnackBarService } from '../../../projects/ui/src/public-api';

@Component({
  selector: 'app-anime-details',
  imports: [Header, Comments, FaIconComponent],
  templateUrl: './anime-details.html',
  styleUrl: './anime-details.css'
})
export class AnimeDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private animeService = inject(AnimeDetailsService);
  private titleService = inject(Title);
  private favoritesService = inject(FavoritesService);
  private snackBar = inject(SnackBarService);

  protected faHeart = faHeart;

  anime: WritableSignal<any> = signal<any>(null);
  animeId: WritableSignal<number> = signal<number>(0);

  protected isFavorited = computed(() =>
    this.favoritesService.ids().has(this.animeId())
  );

  setPageTitle(title: string): void {
    this.titleService.setTitle(`${title} - Whiskers`);
  }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (!id) return;

      this.animeId.set(Number(id));

      void this.favoritesService.load();

      const data = await this.animeService.getAnimeById(id);
      this.anime.set(data);
      this.setPageTitle(data.data.attributes.canonicalTitle);
    });
  }

  getStreamingLinks(): any[] {
    if (!this.anime()?.included) return [];
    return this.anime().included.filter((item: any) => item.type === 'streamingLinks');
  }

  getGenres(): any[] {
    if (!this.anime()?.included) return [];
    return this.anime().included.filter((item: any) => item.type === 'genres');
  }

  async toggleFavorite(): Promise<void> {
    if (this.isFavorited()) {
      this.snackBar.open('Already in your favorites!', 'OK', 3000, 'warning');
      return;
    }

    await this.favoritesService.add(this.animeId());
    this.snackBar.open('Added to favorites!', 'OK', 3000, 'success');
  }
}
