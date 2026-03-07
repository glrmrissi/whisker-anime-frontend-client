import { Component, ElementRef, inject, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCompass, faStar, faFire, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Header } from '../header/header';
import { HomeService } from '../home/home.service';

type SortOption = '-userCount' | '-averageRating' | '-createdAt';
type SubtypeOption = 'ALL' | 'TV' | 'MOVIE' | 'OVA' | 'ONA' | 'SPECIAL';

interface DiscoveryItem {
  id: string;
  coverImage: string;
  canonicalTitle: string;
  subtype: string;
}

const SUBTYPE_MAP: Record<SubtypeOption, string | undefined> = {
  ALL:     undefined,
  TV:      'TV',
  MOVIE:   'MOVIE',
  OVA:     'OVA',
  ONA:     'ONA',
  SPECIAL: 'SPECIAL',
};

const SORT_LABELS: Record<SortOption, string> = {
  '-userCount':     'Most Popular',
  '-averageRating': 'Top Rated',
  '-createdAt':     'Newest',
};

@Component({
  selector: 'app-discovery',
  standalone: true,
  imports: [Header, FaIconComponent, RouterLink],
  templateUrl: './discovery.html',
  styleUrl: './discovery.css',
})
export class Discovery implements OnInit, OnDestroy {
  @ViewChild('sentinel') private sentinelRef!: ElementRef<HTMLElement>;

  private homeService = inject(HomeService);
  private platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;
  private currentOffset = 0;
  private isFetching = false;

  private readonly LIMIT = 24;

  protected faCompass = faCompass;
  protected faStar    = faStar;
  protected faFire    = faFire;
  protected faCalendar = faCalendar;

  protected items        = signal<DiscoveryItem[]>([]);
  protected isLoading    = signal(true);
  protected isLoadingMore = signal(false);
  protected hasMore      = signal(true);

  protected activeSort    = signal<SortOption>('-userCount');
  protected activeSubtype = signal<SubtypeOption>('ALL');

  protected readonly subtypes: SubtypeOption[] = ['ALL', 'TV', 'MOVIE', 'OVA', 'ONA', 'SPECIAL'];
  protected readonly sorts: SortOption[] = ['-userCount', '-averageRating', '-createdAt'];
  protected readonly sortLabels = SORT_LABELS;

  async ngOnInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    await this.load(true);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  async setSort(sort: SortOption): Promise<void> {
    if (sort === this.activeSort()) return;
    this.activeSort.set(sort);
    await this.load(true);
  }

  async setSubtype(subtype: SubtypeOption): Promise<void> {
    if (subtype === this.activeSubtype()) return;
    this.activeSubtype.set(subtype);
    await this.load(true);
  }

  private async load(reset: boolean): Promise<void> {
    if (reset) {
      this.isLoading.set(true);
      this.items.set([]);
      this.currentOffset = 0;
      this.hasMore.set(true);
      this.observer?.disconnect();
      this.observer = null;
    }

    this.isFetching = true;
    try {
      const subtype = SUBTYPE_MAP[this.activeSubtype()];
      const data = await this.homeService.getAnimeDiscovery(
        this.currentOffset,
        this.LIMIT,
        this.activeSort(),
        subtype
      );

      const incoming: DiscoveryItem[] = (data?.data || []).map((anime: any) => ({
        id: anime.id,
        coverImage: anime.attributes.posterImage?.large || anime.attributes.coverImage?.large || '',
        canonicalTitle: anime.attributes.canonicalTitle || '',
        subtype: anime.attributes.subtype || '',
      }));

      this.items.update(prev => reset ? incoming : [...prev, ...incoming]);
      this.currentOffset += incoming.length;

      if (incoming.length < this.LIMIT) {
        this.hasMore.set(false);
      }
    } finally {
      this.isFetching = false;
      if (reset) {
        this.isLoading.set(false);
        setTimeout(() => this.setupObserver());
      }
    }
  }

  private setupObserver(): void {
    if (!isPlatformBrowser(this.platformId) || !this.hasMore()) return;

    this.observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && this.hasMore() && !this.isFetching) {
          this.isLoadingMore.set(true);
          await this.load(false);
          this.isLoadingMore.set(false);
        }
      },
      { rootMargin: '300px' }
    );

    setTimeout(() => {
      if (this.sentinelRef?.nativeElement) {
        this.observer!.observe(this.sentinelRef.nativeElement);
      }
    });
  }
}
