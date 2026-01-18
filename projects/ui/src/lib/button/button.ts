import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';

export type ButtonAppearance = 'default' | 'outline' | 'filled';

@Component({
  selector: 'lib-button',
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrl: './button.css',
  encapsulation: ViewEncapsulation.None,
})
export class Button {
  @Input() appearance: ButtonAppearance = 'default';

  @Input() item: string = '';
}
