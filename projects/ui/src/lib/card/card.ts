import { Component, Input } from '@angular/core';
import { NgClass, CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee, faUser, faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';

export type Tag = string | any;

@Component({
  selector: 'lib-card',
  imports: [NgClass, CommonModule, FontAwesomeModule],
  templateUrl: './card.html',
  styleUrls: ['./card.css'],
})
export class Card {
  faCoffee = faCoffee;
  faUser = faUser;
  faPlay = faPlay;
  faPlus = faPlus;
  @Input() item:
    {
      image: string;
      title: string;
      description: string;
      link: string
      tag: Tag[];
    }
    = { image: '', title: '', description: '', link: '', tag: [] };

  isStringUrl(tag: Tag): boolean {
    return typeof tag === 'string';
  }

  index: number = 0;
  isHovering = false;

  onMouseEnter() {
    this.isHovering = true;
  }

  onMouseLeave() {
    this.isHovering = false;
  }

}
