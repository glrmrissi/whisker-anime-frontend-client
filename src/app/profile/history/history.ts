import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFilm, faTv, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { HistoryService, HistoryItem } from './history.service';
import { AnimeDetailsService } from '../../anime-details/anime.details.service';

export interface HistoryDisplayItem extends HistoryItem {
  title: string;
  coverImage: string;
  routerLink: string[];
}

const MAX_PAGE = 10;

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class History implements OnInit, OnDestroy {
  @ViewChild('sentinel', { static: false }) private sentinelRef!: ElementRef<HTMLElement>;

  private historyService = inject(HistoryService);
  private animeDetailsService = inject(AnimeDetailsService);

  private observer: IntersectionObserver | null = null;
  private currentPage = 1;
  private isFetching = false;

  protected faFilm = faFilm;
  protected faTv = faTv;
  protected faClockRotateLeft = faClockRotateLeft;

  protected items = signal<HistoryDisplayItem[]>([]);
  protected isLoading = signal(true);
  protected isLoadingMore = signal(false);
  protected hasMore = signal(true);

  async ngOnInit(): Promise<void> {
    await this.loadPage(1);
    this.isLoading.set(false);
    this.setupObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private setupObserver(): void {
    this.observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && this.hasMore() && !this.isFetching) {
          await this.loadNextPage();
        }
      },
      { threshold: 0.1 }
    );

    setTimeout(() => {
      if (this.sentinelRef?.nativeElement) {
        this.observer!.observe(this.sentinelRef.nativeElement);
      }
    });
  }

  private async loadNextPage(): Promise<void> {
    const nextPage = this.currentPage + 1;
    if (nextPage > MAX_PAGE) {
      this.hasMore.set(false);
      return;
    }
    this.isLoadingMore.set(true);
    await this.loadPage(nextPage);
    this.isLoadingMore.set(false);
  }

  private async loadPage(page: number): Promise<void> {
    this.isFetching = true;
    try {
      const history = await this.historyService.getHistory(page);

      if (history.length === 0) {
        this.hasMore.set(false);
        return;
      }

      const enriched = await Promise.all(history.map(item => this.enrichItem(item)));
      this.items.update(prev => [...prev, ...enriched]);
      this.currentPage = page;

      if (page >= MAX_PAGE) {
        this.hasMore.set(false);
      }
    } catch {
      this.hasMore.set(false);
    } finally {
      this.isFetching = false;
    }
  }

  private async enrichItem(item: HistoryItem): Promise<HistoryDisplayItem> {
    if (item.episodeId) {
      try {
        const res = await this.animeDetailsService.getEpisodeById(String(item.episodeId));
        const ep = res?.data?.attributes;
        return {
          ...item,
          title: ep?.canonicalTitle ?? `Episode ${ep?.number ?? item.episodeId}`,
          coverImage: ep?.thumbnail?.original ?? '',
          routerLink: item.animeId
            ? ['/anime', String(item.animeId), 'episode', String(item.episodeId)]
            : ['/']
        };
      } catch {
        return this.fallbackItem(item);
      }
    }

    if (item.animeId) {
      try {
        const res = await this.animeDetailsService.getAnimeBasic(String(item.animeId));
        const anime = res?.data?.attributes;
        return {
          ...item,
          title: anime?.canonicalTitle ?? `Anime ${item.animeId}`,
          coverImage: anime?.posterImage?.small ?? '',
          routerLink: ['/anime', String(item.animeId)]
        };
      } catch {
        return this.fallbackItem(item);
      }
    }

    return this.fallbackItem(item);
  }

  private fallbackItem(item: HistoryItem): HistoryDisplayItem {
    return {
      ...item,
      title: item.action,
      coverImage: '',
      routerLink: ['/']
    };
  }

  protected isEpisodeAction(item: HistoryDisplayItem): boolean {
    return item.episodeId != null;
  }

  protected formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  protected formatAction(action: string): string {
    return action
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase());
  }
}
