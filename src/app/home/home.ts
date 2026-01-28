import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Card } from "../../../projects/ui/src/public-api";
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  imports: [Card],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  constructor(
    private readonly homeService: HomeService,
    private cdr: ChangeDetectorRef
  ) {}

  animeTrending: any[] = [];
  animePagination: any[] = [];

  async ngOnInit() {
    await this.homeService.getAnimeTrending().then((data) => {
      this.animeTrending = (data.data || []).map((anime: any) => ({
        id: anime.id,
        coverImage: anime.attributes.posterImage?.large || anime.attributes.coverImage?.large || '',
        canonicalTitle: anime.attributes.canonicalTitle || '',
        description: anime.attributes.description || '',
        link: anime.attributes.slug || '',
        subtype: [anime.attributes.subtype || '']
      }));
      this.cdr.markForCheck();
    });

    await this.homeService.getAnimePagination().then((data) => {
      this.animePagination = (data.data || []).map((anime: any) => ({
        id: anime.id,
        coverImage: anime.attributes.posterImage?.large || anime.attributes.coverImage?.large || '',
        canonicalTitle: anime.attributes.canonicalTitle || '',
        description: anime.attributes.description || '',
        link: anime.attributes.slug || '',
        subtype: [anime.attributes.subtype || '']
      }));

      console.log("Anime Pagination:", this.animePagination);
      this.cdr.markForCheck();
    });
  }

}
