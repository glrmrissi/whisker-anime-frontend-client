import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
})
export class Avatar {
  item = input<{src: string, alt: string}>({src: '', alt: ''});
}
