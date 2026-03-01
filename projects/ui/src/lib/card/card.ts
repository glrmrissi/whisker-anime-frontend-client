import { Component, inject, Input, HostBinding, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee, faUser, faPlay, faPlus, faAngleUp, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../../../../src/api/api.service';
import { Router } from '@angular/router'
import { TooltipDirective } from '../../../../../src/directives/tooltip.directive'
import { SkeletonDirective } from '../../../../../src/directives/skeleton.directive'
export type Tag = string | any;

@Component({
  selector: 'lib-card',
  imports: [CommonModule, FontAwesomeModule, TooltipDirective, SkeletonDirective],
  templateUrl: './card.html',
  styleUrls: ['./card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card implements OnInit {
  protected faCoffee: IconDefinition = faCoffee;
  protected faUser: IconDefinition = faUser;
  protected faPlay: IconDefinition = faPlay;
  protected faPlus: IconDefinition = faPlus;
  protected faAngleUp: IconDefinition = faAngleUp;

  private router = inject(Router);
  constructor(
    private apiService: ApiService
  ) { }
  @Input() item: any = { id: '', coverImage: '', canonicalTitle: '', description: '', link: '', subtype: [] };

  @HostBinding('class.hovering') isHovering: boolean = false;

  isLoading: any = signal(true);

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 500);
  }

  isStringUrl(tag: Tag): boolean {
    return typeof tag === 'string';
  }

  index: number = 0;

  onMouseEnter(): void {
    this.isHovering = true;
  }

  onMouseLeave(): void {
    this.isHovering = false;
  }

  favoriteAnime(): void {
    this.apiService.postV1(`favorites-animes/${this.item.id}??include=castings,genres,streamingLinks`, {}).then(response => {
    }).catch(error => {
      console.error('Error favoriting anime:', error);
    });
  }

  openDialog(): void {
    const urlTree = this.router.createUrlTree(['/anime', this.item.id]);
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_self');
  }
}
