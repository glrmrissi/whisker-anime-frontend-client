import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { AnimeDetailsService } from './anime.details.service';
import { Header } from '../header/header';
import { faAd, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Title } from '@angular/platform-browser';
import { Comments } from '../comments/comments';
@Component({
  selector: 'app-anime-details',
  imports: [Header, Comments],
  templateUrl: './anime-details.html',
  styleUrl: './anime-details.css'
})
export class AnimeDetails implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);

  private animeService: AnimeDetailsService = inject(AnimeDetailsService);

  private titleService: Title = inject(Title);

  protected faAd: IconDefinition = faAd

  setPageTitle(title: string): void {
    this.titleService.setTitle(`${title} - Whiskers`);
  }

  anime: WritableSignal<any> = signal<any>(null);
  animeId: WritableSignal<number> = signal<number>(0)

  async ngOnInit(): Promise<void> {
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

  getStreamingLinks(): any {
    if (!this.anime()?.included) return [];
    return this.anime().included.filter((item: any): boolean => item.type === 'streamingLinks');
  }

  getGenres(): any {
    if (!this.anime()?.included) return [];
    return this.anime().included.filter((item: any): boolean => item.type === 'genres');
  }


}
