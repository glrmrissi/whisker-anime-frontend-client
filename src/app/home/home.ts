import { Component, PLATFORM_ID, inject, signal, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Header } from '../header/header';
import { HeroSlide, HeroSliderComponent } from '../hero-slider/hero-slider';
import { Carousel } from './components/carousel';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HomeService } from './home.service';
import { faBolt, faWater, faStar, faHeart, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Title } from '@angular/platform-browser';

interface InfiniteCarousel {
  id: number;
  title: string;
  icon: IconDefinition;
  items: any[];
}

const INFINITE_POOL: Array<{ sort: string; subtype: string; label: string; icon: IconDefinition }> = [
  { sort: '-averageRating', subtype: 'TV',                      label: 'Top TV Series',     icon: faStar  },
  { sort: '-userCount',     subtype: 'MOVIE',                   label: 'Popular Movies',    icon: faWater },
  { sort: '-createdAt',     subtype: 'ONA',                     label: 'New ONAs',          icon: faHeart  },
  { sort: '-averageRating', subtype: 'OVA',                     label: 'Best OVAs',         icon: faStar  },
  { sort: '-userCount',     subtype: 'TV',                      label: 'Most Watched TV',   icon: faWater },
  { sort: '-createdAt',     subtype: 'MOVIE',                   label: 'New Movies',        icon: faHeart  },
  { sort: '-averageRating', subtype: 'TV,OVA,ONA,MOVIE,SPECIAL', label: 'All Time Best',   icon: faStar  },
  { sort: '-userCount',     subtype: 'ONA',                     label: 'Popular ONAs',      icon: faWater },
  { sort: '-createdAt',     subtype: 'SPECIAL',                 label: 'Recent Specials',   icon: faBolt  },
  { sort: '-averageRating', subtype: 'MOVIE',                   label: 'Top Movies',        icon: faStar  },
  { sort: '-userCount',     subtype: 'OVA',                       label: 'Popular OVAs',        icon: faWater },
  { sort: '-createdAt',     subtype: 'TV',                        label: 'New TV Series',       icon: faHeart  },
  { sort: '-averageRating', subtype: 'ONA',                       label: 'Top ONAs',            icon: faStar  },
  { sort: '-userCount',     subtype: 'SPECIAL',                   label: 'Popular Specials',    icon: faHeart },
  { sort: '-createdAt',     subtype: 'OVA',                       label: 'Recent OVAs',         icon: faBolt  },
  { sort: '-userCount',     subtype: 'TV,OVA,ONA,MOVIE,SPECIAL',  label: 'Most Popular',        icon: faWater },
  { sort: '-createdAt',     subtype: 'TV,OVA,ONA,MOVIE,SPECIAL',  label: 'Just Released',       icon: faBolt  },
  { sort: '-averageRating', subtype: 'SPECIAL',                   label: 'Best Specials',       icon: faStar  },
  { sort: '-averageRating', subtype: 'TV,MOVIE',                  label: 'Top Rated Main',      icon: faHeart  },
  { sort: '-userCount',     subtype: 'TV,MOVIE',                  label: 'Trending Now',        icon: faWater },
  { sort: '-createdAt',     subtype: 'TV,MOVIE',                  label: 'Fresh Releases',      icon: faHeart  },
  { sort: '-averageRating', subtype: 'OVA,ONA',                   label: 'Hidden Gems',         icon: faStar  },
  { sort: '-userCount',     subtype: 'OVA,ONA',                   label: 'Rising Shorts',       icon: faHeart },
  { sort: '-createdAt',     subtype: 'ONA,SPECIAL',               label: 'New Extras',          icon: faBolt  },
  { sort: '-userCount',     subtype: 'MOVIE,SPECIAL',             label: 'Popular Picks',       icon: faWater },

];

const MAX_CYCLES = 5;

@Component({
  selector: 'app-home',
  imports: [Header, HeroSliderComponent, Carousel, FaIconComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly homeService = inject(HomeService);
  private readonly titleService = inject(Title);

  @ViewChild('sentinelRating')  private sentinelRating!:  ElementRef<HTMLElement>;
  @ViewChild('sentinelViewers') private sentinelViewers!: ElementRef<HTMLElement>;
  @ViewChild('sentinelLatest')  private sentinelLatest!:  ElementRef<HTMLElement>;
  @ViewChild('sentinelOvas')    private sentinelOvas!:    ElementRef<HTMLElement>;
  @ViewChild('sentinelBottom')  private sentinelBottom!:  ElementRef<HTMLElement>;

  private observer: IntersectionObserver | null = null;
  private infiniteIndex = 0; // posição global no pool × ciclos
  private isLoadingInfinite = false;

  heroSlides    = signal<HeroSlide[]>([]);
  recommendations = signal<any[]>([]);
  averageRating = signal<any[]>([]);
  moreViewers   = signal<any[]>([]);
  latestRelease = signal<any[]>([]);
  ovasRelease   = signal<any[]>([]);
  infiniteCarousels = signal<InfiniteCarousel[]>([]);

  isLoading        = signal<boolean>(true);
  isLoadingMore    = signal<boolean>(false);

  protected faBolt  = faBolt;
  protected faWater = faWater;
  protected faStar  = faStar;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.titleService.setTitle('Whiskers');
      this.fetchInitial();
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private async fetchInitial() {
    this.isLoading.set(true);
    try {
      await Promise.all([this.loadHero(), this.loadRecommendations()]);
    } finally {
      this.isLoading.set(false);
      setTimeout(() => this.setupObservers());
    }
  }

  private setupObservers(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const namedEntries: Array<{ ref: ElementRef<HTMLElement>; loader: () => Promise<void> }> = [
      { ref: this.sentinelRating,  loader: () => this.loadTopRated()    },
      { ref: this.sentinelViewers, loader: () => this.loadMoreViewers() },
      { ref: this.sentinelLatest,  loader: () => this.loadLatest()      },
      { ref: this.sentinelOvas,    loader: () => this.loadOvas()        },
    ];

    this.observer = new IntersectionObserver(
      (observed) => {
        for (const entry of observed) {
          if (!entry.isIntersecting) continue;

          const named = namedEntries.find(e => e.ref?.nativeElement === entry.target);
          if (named) {
            this.observer!.unobserve(entry.target);
            named.loader();
            continue;
          }

          if (this.sentinelBottom?.nativeElement === entry.target) {
            this.loadInfinite();
          }
        }
      },
      { rootMargin: '300px' }
    );

    for (const { ref } of namedEntries) {
      if (ref?.nativeElement) this.observer.observe(ref.nativeElement);
    }

    if (this.sentinelBottom?.nativeElement) {
      this.observer.observe(this.sentinelBottom.nativeElement);
    }
  }

  private async loadInfinite(): Promise<void> {
    const cycle = Math.floor(this.infiniteIndex / INFINITE_POOL.length);
    if (this.isLoadingInfinite || cycle >= MAX_CYCLES) return;

    this.isLoadingInfinite = true;
    this.isLoadingMore.set(true);

    const config = INFINITE_POOL[this.infiniteIndex % INFINITE_POOL.length];
    const page = String(cycle + 1);

    try {
      const data = await this.homeService.getAnimePagination(page, '20', config.sort, config.subtype);
      const items = this.mapAnimeData(data);

      if (items.length > 0) {
        this.infiniteCarousels.update(prev => [
          ...prev,
          { id: this.infiniteIndex, title: config.label, icon: config.icon, items }
        ]);
      }

      this.infiniteIndex++;

      if (Math.floor(this.infiniteIndex / INFINITE_POOL.length) >= MAX_CYCLES) {
        this.observer?.unobserve(this.sentinelBottom.nativeElement);
      }
    } finally {
      this.isLoadingInfinite = false;
      this.isLoadingMore.set(false);
    }
  }

  private mapAnimeData(data: any) {
    return (data?.data || []).map((anime: any) => ({
      id: anime.id,
      coverImage: anime.attributes.posterImage?.large || anime.attributes.coverImage?.large || '',
      canonicalTitle: anime.attributes.canonicalTitle || '',
      description: anime.attributes.description || '',
      link: anime.attributes.slug || '',
      subtype: [anime.attributes.subtype || '']
    }));
  }

  private async loadHero() {
    const data = await this.homeService.getAnimeTrending();
    const mapped = (data?.data || []).map((anime: any) => ({
      id: anime.id,
      badgeText: 'On the rise',
      title: anime.attributes.canonicalTitle || '',
      rating: anime.attributes.averageRating
        ? parseFloat((parseFloat(anime.attributes.averageRating) / 10).toFixed(1))
        : 0,
      subtype: anime.attributes.subtype || '',
      year: new Date(anime.attributes.startDate).getFullYear(),
      description: anime.attributes.description || '',
      backgroundUrl: anime.attributes.coverImage?.large || ''
    }));
    this.heroSlides.set(mapped);
  }

  private async loadRecommendations() {
    const data = await this.homeService.getRecommendations();
    const items = Array.isArray(data) ? data : (data ? [data] : []);
    const mapped = items.map((anime: any) => ({
      id: anime.id,
      coverImage: anime.attributes.posterImage?.medium || anime.attributes.posterImage?.small || '',
      canonicalTitle: anime.attributes.canonicalTitle || '',
      description: anime.attributes.synopsis || '',
      link: anime.id,
      subtype: [anime.attributes.subtype || '']
    }));
    this.recommendations.set(mapped);
  }

  private async loadTopRated() {
    const data = await this.homeService.getAnimePagination('1', '20', '-averageRating', 'TV,OVA,ONA,MOVIE,SPECIAL');
    this.averageRating.set(this.mapAnimeData(data));
  }

  private async loadMoreViewers() {
    const data = await this.homeService.getAnimePagination('1', '20', '-userCount', 'TV,OVA,ONA,MOVIE,SPECIAL');
    this.moreViewers.set(this.mapAnimeData(data));
  }

  private async loadLatest() {
    const data = await this.homeService.getAnimePagination('1', '20', '-createdAt', 'TV,OVA,ONA,MOVIE,SPECIAL');
    this.latestRelease.set(this.mapAnimeData(data));
  }

  private async loadOvas() {
    const data = await this.homeService.getAnimePagination('1', '20', '-createdAt', 'OVA');
    this.ovasRelease.set(this.mapAnimeData(data));
  }
}
