import { ActivatedRoute, RouterLink } from '@angular/router';
import { Component, computed, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { AnimeDetailsService } from './anime.details.service';
import { Header } from '../header/header';
import { faArrowUp, faComments, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Title } from '@angular/platform-browser';
import { Comments } from '../comments/comments';
import { FavoritesService } from '../favorites/favorites.service';
import { SnackBarService } from '../../../projects/ui/src/public-api';

type Tab = 'synopsis' | 'episodes';
const EPISODE_LIMIT = 20;

@Component({
  selector: 'app-anime-details',
  imports: [Header, Comments, FaIconComponent, RouterLink],
  templateUrl: './anime-details.html',
  styleUrl: './anime-details.css'
})
export class AnimeDetails implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private animeService = inject(AnimeDetailsService);
  private titleService = inject(Title);
  private favoritesService = inject(FavoritesService);
  private snackBar = inject(SnackBarService);

  protected faHeart = faHeart;
  protected faArrowUp = faArrowUp;
  protected faComments = faComments;

  protected fabX = signal(24);
  protected fabY = signal(320);

  private hasDragged = false;
  private onMouseMove!: (e: MouseEvent) => void;
  private onMouseUp!: (e: MouseEvent) => void;
  private onTouchMove!: (e: TouchEvent) => void;
  private onTouchEnd!: () => void;

  anime: WritableSignal<any> = signal<any>(null);
  animeId: WritableSignal<number> = signal<number>(0);

  protected activeTab = signal<Tab>('synopsis');
  protected episodes = signal<any[]>([]);
  protected isLoadingEpisodes = signal(false);
  protected hasMoreEpisodes = signal(false);

  private episodesOffset = 0;
  protected currentAnimeId = '';

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
      this.currentAnimeId = id;
      this.activeTab.set('synopsis');
      this.episodes.set([]);
      this.episodesOffset = 0;

      void this.favoritesService.load();

      const data = await this.animeService.getAnimeById(id);
      this.anime.set(data);
      this.setPageTitle(data.data.attributes.canonicalTitle);
    });
  }

  switchTab(tab: Tab): void {
    this.activeTab.set(tab);
    if (tab === 'episodes' && this.episodes().length === 0) {
      void this.loadEpisodes();
    }
  }

  async loadEpisodes(): Promise<void> {
    if (this.isLoadingEpisodes()) return;
    this.isLoadingEpisodes.set(true);

    try {
      const res = await this.animeService.getAnimeEpisodes(
        this.currentAnimeId, EPISODE_LIMIT, this.episodesOffset
      );
      const items: any[] = res?.data ?? [];
      this.episodes.update(prev => [...prev, ...items]);
      this.episodesOffset += items.length;
      const total = res?.meta?.count ?? 0;
      this.hasMoreEpisodes.set(this.episodesOffset < total);
    } finally {
      this.isLoadingEpisodes.set(false);
    }
  }

  loadMoreEpisodes(): void {
    void this.loadEpisodes();
  }

  getStreamingLinks(): any[] {
    if (!this.anime()?.included) return [];
    return this.anime().included.filter((item: any) => item.type === 'streamingLinks');
  }

  getGenres(): any[] {
    if (!this.anime()?.included) return [];
    return this.anime().included.filter((item: any) => item.type === 'genres');
  }

  startDrag(event: MouseEvent): void {
    event.preventDefault();
    this.hasDragged = false;

    const startX = event.clientX;
    const startY = event.clientY;
    const initRight = this.fabX();
    const initTop = this.fabY();

    this.onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) this.hasDragged = true;
      if (this.hasDragged) {
        this.fabX.set(Math.max(8, initRight - dx));
        this.fabY.set(Math.max(8, Math.min(window.innerHeight - 110, initTop + dy)));
      }
    };

    this.onMouseUp = () => {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    };

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  startDragTouch(event: TouchEvent): void {
    const touch = event.touches[0];
    this.hasDragged = false;

    const startX = touch.clientX;
    const startY = touch.clientY;
    const initRight = this.fabX();
    const initTop = this.fabY();

    this.onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) this.hasDragged = true;
      if (this.hasDragged) {
        e.preventDefault();
        this.fabX.set(Math.max(8, initRight - dx));
        this.fabY.set(Math.max(8, Math.min(window.innerHeight - 110, initTop + dy)));
      }
    };

    this.onTouchEnd = () => {
      document.removeEventListener('touchmove', this.onTouchMove);
      document.removeEventListener('touchend', this.onTouchEnd);
    };

    document.addEventListener('touchmove', this.onTouchMove, { passive: false });
    document.addEventListener('touchend', this.onTouchEnd);
  }

  scrollToTop(): void {
    if (this.hasDragged) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToComments(): void {
    if (this.hasDragged) return;
    document.querySelector('.comments-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
  }

  async toggleFavorite(): Promise<void> {
    if (this.isFavorited()) {
      this.snackBar.open('Already in your favorites!', 3000, 'warning');
      return;
    }

    await this.favoritesService.add(this.animeId());
    this.snackBar.open('Added to favorites!', 3000, 'success');
  }
}
