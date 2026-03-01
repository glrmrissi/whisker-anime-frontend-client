import { Component, PLATFORM_ID, inject, signal, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Header } from '../header/header';
import { HeroSlide, HeroSliderComponent } from '../hero-slider/hero-slider';
import { Carousel } from './components/carousel';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HomeService } from './home.service';
import { faBolt, faWater } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  imports: [Header, HeroSliderComponent, Carousel, FaIconComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly homeService = inject(HomeService);

  heroSlides = signal<HeroSlide[]>([]);
  latestRelease = signal<any[]>([]);
  moreViewers = signal<any[]>([]);
  ovasRelease = signal<any[]>([]);
  averageRating = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  protected faBolt = faBolt;
  protected faWater = faWater;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchAllData();
    }
  }

  private async fetchAllData() {
    this.isLoading.set(true);
    
    try {
      await Promise.all([
        this.loadHero(),
        this.loadLatest(),
        this.loadMoreViewers(),
        this.loadOvas(),
        this.loadTopRated()
      ]);
    } finally {
      this.isLoading.set(false);
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

  private async loadLatest() {
    const data = await this.homeService.getAnimePagination('1', '20', '-createdAt', 'TV,OVA,ONA,MOVIE,SPECIAL');
    this.latestRelease.set(this.mapAnimeData(data));
  }

  private async loadMoreViewers() {
    const data = await this.homeService.getAnimePagination('1', '20', '-userCount', 'TV,OVA,ONA,MOVIE,SPECIAL');
    this.moreViewers.set(this.mapAnimeData(data));
  }

  private async loadOvas() {
    const data = await this.homeService.getAnimePagination('1', '20', '-createdAt', 'OVA');
    this.ovasRelease.set(this.mapAnimeData(data));
  }

  private async loadTopRated() {
    const data = await this.homeService.getAnimePagination('1', '20', '-averageRating', 'TV,OVA,ONA,MOVIE,SPECIAL');
    this.averageRating.set(this.mapAnimeData(data));
  }
}