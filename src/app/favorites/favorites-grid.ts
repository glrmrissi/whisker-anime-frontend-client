import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface FavoriteItem {
  id: string;
  coverImage: string;
  canonicalTitle: string;
  subtype: string[];
}

@Component({
  selector: 'app-favorites-grid',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './favorites-grid.html',
  styleUrl: './favorites-grid.css'
})
export class FavoritesGrid {
  @Input() items: FavoriteItem[] = [];
}
