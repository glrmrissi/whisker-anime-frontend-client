import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AnimeDetailsService } from './anime.details.service';
import { Header } from '../header/header';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faAd } from '@fortawesome/free-solid-svg-icons';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-anime-details',
  imports: [Header],
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

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      const data = await this.animeService.getAnimeById(id)
      await this.setPageTitle(data.data.attributes.canonicalTitle)
      this.anime.set(data);
      this.getGenres();
      this.getStreamingLinks();
      console.log(await this.anime())
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