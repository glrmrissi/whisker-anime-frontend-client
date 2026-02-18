import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AnimeDetailsService } from './anime.details.service';

@Component({
  selector: 'app-anime-details',
  templateUrl: './anime-details.html'
})
export class AnimeDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private animeService = inject(AnimeDetailsService);

  anime = signal<any>(null);

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      const data = await this.animeService.getAnimeBySlug(id) 
      this.anime.set(data);
    });
  }
}