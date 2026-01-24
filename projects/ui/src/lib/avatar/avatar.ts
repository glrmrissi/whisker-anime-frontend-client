import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
})
export class Avatar {
  @Input() item: { src: string; alt: string } = { src: '', alt: '' };
}
