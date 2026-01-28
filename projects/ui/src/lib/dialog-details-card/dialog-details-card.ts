import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../../src/api/api.service';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export const DialogData = {
  id: '',
};

type ItemDetails = {
  title: string,
  synopsis: string,
  averageRating: string,
  userCount: string,
  favoritesCount: string,
  startDate: string,
  endDate: string,
  ageRating: string,
  episodeCount: string,
  episodeLength: string,
  youtubeVideoId?: string,
  nsfw: boolean,
}

@Component({
  selector: 'lib-dialog-details-card',
  imports: [FaIconComponent],
  templateUrl: './dialog-details-card.html',
  styleUrls: ['./dialog-details-card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DialogDetailsCard implements OnInit {

  constructor(
    private readonly apiService: ApiService,
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef)
  ) { }

  readonly dialogRef = inject(MatDialogRef<DialogDetailsCard>);
  protected data: any = inject(MAT_DIALOG_DATA);
  protected faClose = faClose;
  protected srcImg: SafeUrl | string | null = null;
  protected item: ItemDetails = {} as ItemDetails;
  protected sanitizer = inject(DomSanitizer);

  async ngOnInit() {
    console.log("Dialog data:",this.data);
    await this.fetchAnimeDetails(this.data);
  }

  async fetchAnimeDetails(id: string): Promise<void> {
  try {
    const result = await this.apiService.getV1(`kitsu-api/anime/${id}`, true);
    
    const attrs = result.data.attributes;

    const details: ItemDetails = {
      title: attrs.canonicalTitle,
      synopsis: attrs.synopsis,
      averageRating: attrs.averageRating,
      userCount: attrs.userCount,
      favoritesCount: attrs.favoritesCount,
      startDate: attrs.startDate,
      endDate: attrs.endDate,
      ageRating: attrs.ageRating,
      episodeCount: attrs.episodeCount,
      episodeLength: attrs.episodeLength,
      youtubeVideoId: attrs.youtubeVideoId,
      nsfw: attrs.nsfw,
    };

    this.srcImg = attrs.coverImage?.large || attrs.posterImage?.large;
    this.item = details;
    
    this.cdr.markForCheck();
    console.log("Fetched item details:", this.item);
  } catch (error) {
    console.error("Erro ao buscar detalhes:", error);
  }
}

  close() {
    this.dialogRef.close();
  }
}