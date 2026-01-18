import {Component, Input} from '@angular/core';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { NgClass } from '@angular/common';

export type AccordionAppearance = 'default' | 'outline' | 'filled';

@Component({
  selector: 'lib-accordion',
  imports: [CdkAccordionModule, NgClass],
  templateUrl: './accordion.html',
  styleUrl: './accordion.css',
})
export class Accordion {
  @Input() items: any[] = [];

  @Input() appearance: AccordionAppearance = 'default';
}
