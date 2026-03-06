import { ActivatedRoute, RouterLink } from '@angular/router';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { AnimeDetailsService } from '../anime-details/anime.details.service';
import { Header } from '../header/header';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faChevronLeft, faChevronRight, faCalendar, faClock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-episode-details',
  standalone: true,
  imports: [Header, FaIconComponent, RouterLink],
  templateUrl: './episode-details.html',
  styleUrl: './episode-details.css'
})
export class EpisodeDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(AnimeDetailsService);
  private sanitizer = inject(DomSanitizer);
  private titleService = inject(Title);

  protected faArrowLeft = faArrowLeft;
  protected faChevronLeft = faChevronLeft;
  protected faChevronRight = faChevronRight;
  protected faCalendar = faCalendar;
  protected faClock = faClock;

  protected episode = signal<any>(null);
  protected anime = signal<any>(null);
  protected prevEpisode = signal<any>(null);
  protected nextEpisode = signal<any>(null);
  protected isLoading = signal(true);

  protected animeId = '';
  protected episodeId = '';

  protected trailerUrl = computed<SafeResourceUrl | null>(() => {
    const id = this.anime()?.data?.attributes?.youtubeVideoId;
    if (!id) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`
    );
  });

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async params => {
      this.animeId = params.get('animeId') ?? '';
      this.episodeId = params.get('episodeId') ?? '';

      if (!this.animeId || !this.episodeId) return;

      this.isLoading.set(true);
      this.episode.set(null);
      this.anime.set(null);
      this.prevEpisode.set(null);
      this.nextEpisode.set(null);

      try {
        const [epRes, animeRes] = await Promise.all([
          this.service.getEpisodeById(this.episodeId),
          this.service.getAnimeBasic(this.animeId)
        ]);

        this.episode.set(epRes);
        this.anime.set(animeRes);
        this.titleService.setTitle(
          `${epRes.data.attributes.canonicalTitle ?? 'Episode ' + epRes.data.attributes.number} - Whiskers`
        );

        const epNumber: number = epRes.data.attributes.number ?? 1;
        const adjacentRes = await this.service.getAdjacentEpisodes(this.animeId, epNumber);
        const adjacent: any[] = adjacentRes?.data ?? [];

        this.prevEpisode.set(adjacent.find((e: any) => e.attributes.number === epNumber - 1) ?? null);
        this.nextEpisode.set(adjacent.find((e: any) => e.attributes.number === epNumber + 1) ?? null);
      } finally {
        this.isLoading.set(false);
      }
    });
  }
}
