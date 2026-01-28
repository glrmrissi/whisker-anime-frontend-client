import { Component, inject, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee, faUser, faPlay, faPlus, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { DialogData, DialogDetailsCard } from '../dialog-details-card/dialog-details-card';
import { MatDialog } from '@angular/material/dialog';

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
  
  constructor() {}
  
  @Input() item: any = { id: '',coverImage: '', canonicalTitle: '', description: '', link: '', subtype: [] };
  
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

  openDialog(): void {
    this.dialog.open(DialogDetailsCard, {
      width: '40rem',
      height: '70dvh',
      data: this.item.id,
    });
  }

}
