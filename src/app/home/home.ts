import { isPlatformBrowser } from '@angular/common';
import { Component, ChangeDetectorRef, AfterViewInit, PLATFORM_ID, inject } from '@angular/core';
import { Card } from "../../../projects/ui/src/public-api";
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  imports: [Card],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {

  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private readonly homeService: HomeService,
    private cdr: ChangeDetectorRef
  ) {}

  animeTrending: any[] = [];
  animePagination: any[] = [];

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    await this.fetchTrendingAnime();
  }

  async fetchTrendingAnime() {
    try {
      const data = await this.homeService.getAnimeTrending();
      this.animeTrending = (data?.data || []).map((anime: any) => ({
        id: anime.id,
        coverImage: anime.attributes.posterImage?.large || anime.attributes.coverImage?.large || '',
        canonicalTitle: anime.attributes.canonicalTitle || '',
        description: anime.attributes.description || '',
        link: anime.attributes.slug || '',
        subtype: [anime.attributes.subtype || '']
      }));
      this.cdr.markForCheck();
    } catch {
      this.animeTrending = [];
    }

    try {
      const data = await this.homeService.getAnimePagination();
      this.animePagination = (data?.data || []).map((anime: any) => ({
        id: anime.id,
        coverImage: anime.attributes.posterImage?.large || anime.attributes.coverImage?.large || '',
        canonicalTitle: anime.attributes.canonicalTitle || '',
        description: anime.attributes.description || '',
        link: anime.attributes.slug || '',
        subtype: [anime.attributes.subtype || '']
      }));
      this.cdr.markForCheck();
    } catch {
      this.animePagination = [];
    }
  }
}
