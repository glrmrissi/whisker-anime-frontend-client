import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { AnimeDetailsService } from './anime.details.service';
import { Header } from '../header/header';
import { faAd } from '@fortawesome/free-solid-svg-icons';
import { Title } from '@angular/platform-browser';
import { Comments } from '../comments/comments';
@Component({
  selector: 'app-anime-details',
  imports: [Header, Comments],
  templateUrl: './anime-details.html',
  styleUrl: './anime-details.css'
})
export class AnimeDetails implements OnInit {
  private route = inject(ActivatedRoute);

  private animeService = inject(AnimeDetailsService);

  private titleService = inject(Title);


  protected faAd = faAd

  setPageTitle(title: string) {
    this.titleService.setTitle(`${title} - Whiskers`);
  }

  anime = signal<any>(null);
  animeId = signal<number>(0)

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (id) {
        this.animeId.set(Number(id));
        const data = await this.animeService.getAnimeById(id);
        this.anime.set(data);
        this.setPageTitle(data.data.attributes.canonicalTitle);
        this.getGenres();
        this.getStreamingLinks();
      }
    });
  }

  getStreamingLinks() {
    if (!this.anime()?.included) return [];
    return this.anime().included.filter((item: any) => item.type === 'streamingLinks');
  }

  getGenres() {
    if (!this.anime()?.included) return [];
    return this.anime().included.filter((item: any) => item.type === 'genres');
  }


}