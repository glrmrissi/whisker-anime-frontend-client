import { Component, inject, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee, faUser, faPlay, faPlus, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../../../src/api/api.service';
import { DialogError } from '../dialog-error/dialog-error';
import { Router } from '@angular/router'

export type Tag = string | any;

@Component({
  selector: 'lib-card',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './card.html',
  styleUrls: ['./card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  protected faCoffee = faCoffee;
  protected faUser = faUser;
  protected faPlay = faPlay;
  protected faPlus = faPlus;
  protected faAngleUp = faAngleUp;

  readonly dialog = inject(MatDialog);

  private router = inject(Router);

  constructor(
    private apiService: ApiService
  ) { }
  @Input() item: any = { id: '', coverImage: '', canonicalTitle: '', description: '', link: '', subtype: [] };

  @HostBinding('class.hovering') isHovering = false;

  isStringUrl(tag: Tag): boolean {
    return typeof tag === 'string';
  }

  index: number = 0;

  onMouseEnter() {
    this.isHovering = true;
  }

  onMouseLeave() {
    this.isHovering = false;
  }

  favoriteAnime() {
    this.apiService.postV1(`favorites-animes/${this.item.id}`, {}).then(response => {
    }).catch(error => {
      console.error('Error favoriting anime:', error);
      if ((error as any)?.status === 409) {
        this.dialog.open(DialogError, {
          width: '30rem',
          height: '30dvh',
          data: { message: `Failed to mark anime as favorite.
            Maybe it is already marked as favorite.` }
        });
      }
    });
  }


  openDialog(): void {
    this.router.navigate(['/anime', this.item.id]);
  }

}
