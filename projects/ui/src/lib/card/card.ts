import {
  Component, inject, Input, HostBinding,
  ChangeDetectionStrategy, signal, OnInit, computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faPlay, faPlus, faAngleUp, faCheck, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { TooltipDirective } from '../../../../../src/directives/tooltip.directive';
import { SkeletonDirective } from '../../../../../src/directives/skeleton.directive';
import { FavoritesService } from '../../../../../src/app/favorites/favorites.service';

export type Tag = string | any;

@Component({
  selector: 'lib-card',
  imports: [CommonModule, FontAwesomeModule, TooltipDirective, SkeletonDirective],
  templateUrl: './card.html',
  styleUrls: ['./card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card implements OnInit {
  protected faUser: IconDefinition = faUser;
  protected faPlay: IconDefinition = faPlay;
  protected faPlus: IconDefinition = faPlus;
  protected faAngleUp: IconDefinition = faAngleUp;
  protected faCheck: IconDefinition = faCheck;

  private router = inject(Router);
  private favoritesService = inject(FavoritesService);

  @Input() item: any = { id: '', coverImage: '', canonicalTitle: '', description: '', link: '', subtype: [] };

  @HostBinding('class.hovering') isHovering: boolean = false;

  isLoading = signal(true);

  protected isFavorited = computed(() =>
    this.favoritesService.ids().has(Number(this.item?.id))
  );

  ngOnInit(): void {
    void this.favoritesService.load();
    setTimeout(() => this.isLoading.set(false), 500);
  }

  isStringUrl(tag: Tag): boolean {
    return typeof tag === 'string';
  }

  onMouseEnter(): void {
    this.isHovering = true;
  }

  onMouseLeave(): void {
    this.isHovering = false;
  }

  async favoriteAnime(): Promise<void> {
    if (this.isFavorited()) return;
    await this.favoritesService.add(Number(this.item.id));
  }

  openDialog(): void {
    this.router.navigate(['/anime', this.item.id]);
  }
}
