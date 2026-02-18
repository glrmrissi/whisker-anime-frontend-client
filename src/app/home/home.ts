import { isPlatformBrowser } from '@angular/common';
import { Component, ChangeDetectorRef, AfterViewInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { HomeService } from './home.service';
import { Header } from '../header/header';
import { HeroSlide, HeroSliderComponent } from '../hero-slider/hero-slider';
import { AnimeItem, Carousel } from './components/carousel';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBolt, faWater } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-home',
  imports: [Header, HeroSliderComponent, Carousel, FaIconComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {

  private readonly platformId = inject(PLATFORM_ID);

  protected faBolt = faBolt
  protected faWater = faWater

  constructor(
    private readonly homeService: HomeService,
    private cdr: ChangeDetectorRef
  ) { }

  animeTrending: AnimeItem[] = [];
  latestRelease: any[] = [];
  ovasRelease: any[] = [];
  averageRating: any[] = [];
  favoriteAnimes: any[] = [];

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    await this.fetchTrendingAnime();
    await this.getAnimeTrending()
  }

  heroSlides = signal<HeroSlide[]>([])

  async getAnimeTrending() {
    try {
      const data = await this.homeService.getAnimeTrending();

      const heroSlides = (data?.data || []).map((anime: any) => {
        const year = new Date(anime.attributes.startDate).getFullYear();
        return {
          badgeText: 'On the rise',
          title: anime.attributes.canonicalTitle || '',
          rating: anime.attributes.averageRating
            ? parseFloat((parseFloat(anime.attributes.averageRating) / 10).toFixed(1))
            : 0,
          subtype: anime.attributes.subtype || '',
          year: year,
          description: anime.attributes.description || '',
          backgroundUrl: anime.attributes.coverImage?.large || ''
        };
      });

      this.heroSlides.set(heroSlides);
      this.cdr.markForCheck();
    } catch (error) {
      this.heroSlides.set([]);
    }
  }

  async fetchTrendingAnime() {
    try {
      const data = await this.homeService.getAnimePagination('1', '20', '-startDate', 'TV,OVA,ONA,MOVIE,SPECIAL');
      this.latestRelease = (data?.data || []).map((anime: any) => ({
        id: anime.id,
        coverImage: anime.attributes.posterImage?.large || anime.attributes.coverImage?.large || '',
        canonicalTitle: anime.attributes.canonicalTitle || '',
        description: anime.attributes.description || '',
        link: anime.attributes.slug || '',
        subtype: [anime.attributes.subtype || '']
      }));
      this.cdr.markForCheck();
    } catch (error) {
      this.latestRelease = [];
    }

    try {
      const data = await this.homeService.getAnimePagination('1', '20', '-startDate', 'OVA');
      this.ovasRelease = (data?.data || []).map((anime: any) => ({
        id: anime.id,
        coverImage: anime.attributes.posterImage?.large || anime.attributes.coverImage?.large || '',
        canonicalTitle: anime.attributes.canonicalTitle || '',
        description: anime.attributes.description || '',
        link: anime.attributes.slug || '',
        subtype: [anime.attributes.subtype || '']
      }));
      this.cdr.markForCheck();
    } catch (error) {
      this.ovasRelease = [];
    }

    try {
      const data = await this.homeService.getAnimePagination('1', '20', '-averageRating', 'TV,OVA,ONA,MOVIE,SPECIAL');
      this.averageRating = (data?.data || []).map((anime: any) => ({
        id: anime.id,
        coverImage: anime.attributes.posterImage?.large || anime.attributes.coverImage?.large || '',
        canonicalTitle: anime.attributes.canonicalTitle || '',
        description: anime.attributes.description || '',
        link: anime.attributes.slug || '',
        subtype: [anime.attributes.subtype || '']
      }));
      this.cdr.markForCheck();
    } catch (error) {
      this.averageRating = [];
    }

    try {
      const data = await this.homeService.getFavoriteAnimes();
      this.favoriteAnimes = (data?.data || []).map((anime: any) => ({
        id: anime.id,
        coverImage: anime.attributes.posterImage?.large || anime.attributes.coverImage?.large || '',
        canonicalTitle: anime.attributes.canonicalTitle || '',
        description: anime.attributes.description || '',
        link: anime.attributes.slug || '',
        subtype: [anime.attributes.subtype || '']
      }));
      this.cdr.markForCheck();
    } catch (error) {
      this.favoriteAnimes = [];
    }
  }
}
