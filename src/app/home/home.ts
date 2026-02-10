import { isPlatformBrowser } from '@angular/common';
import { Component, ChangeDetectorRef, AfterViewInit, PLATFORM_ID, inject } from '@angular/core';
import { Card } from "../../../projects/ui/src/public-api";
import { HomeService } from './home.service';
import { Header } from '../header/header';
import { MatDialog } from '@angular/material/dialog';
import { DialogError } from '../../../projects/ui/src/lib/dialog-error/dialog-error';

@Component({
  selector: 'app-home',
  imports: [Card, Header],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {

  private readonly platformId = inject(PLATFORM_ID);
  private readonly matDialog = inject(MatDialog);

  constructor(
    private readonly homeService: HomeService,
    private cdr: ChangeDetectorRef
  ) { }

  animeTrending: any[] = [];
  animePagination: any[] = [];
  favoriteAnimes: any[] = [];

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
    } catch (error) {
      this.animePagination = [];
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
