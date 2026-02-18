import { Directive, ElementRef, HostListener, Input, inject, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  @Input() appTooltip: string = '';
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'top';
  
  private el = inject(ElementRef);
  private tooltipElement?: HTMLElement;
  
  @HostListener('mouseenter')
  onMouseEnter() {
    this.show();
  }
  
  @HostListener('mouseleave')
  onMouseLeave() {
    this.hide();
  }
  
  ngOnDestroy() {
    this.hide();
  }
  
  private show() {
    if (!this.appTooltip) return;
    
    this.hide();
    
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.className = `tooltip tooltip-${this.position}`;
    this.tooltipElement.textContent = this.appTooltip;
    this.tooltipElement.style.cssText = `
      position: absolute;
      background: #333;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 1000;
      pointer-events: none;
    `;
    
    document.body.appendChild(this.tooltipElement);
    
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.positionTooltip(rect);
  }
  
  private positionTooltip(rect: DOMRect) {
    if (!this.tooltipElement) return;
    
    const offset = 8;
    let top = 0, left = 0;
    
    switch (this.position) {
      case 'top':
        top = rect.top - this.tooltipElement.offsetHeight - offset;
        left = rect.left + rect.width / 2 - this.tooltipElement.offsetWidth / 2;
        break;
      case 'bottom':
        top = rect.bottom + offset;
        left = rect.left + rect.width / 2 - this.tooltipElement.offsetWidth / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - this.tooltipElement.offsetHeight / 2;
        left = rect.left - this.tooltipElement.offsetWidth - offset;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - this.tooltipElement.offsetHeight / 2;
        left = rect.right + offset;
        break;
    }
    
    this.tooltipElement.style.top = top + 'px';
    this.tooltipElement.style.left = left + 'px';
  }
  
  private hide() {
    if (this.tooltipElement) {
      this.tooltipElement.remove();
      this.tooltipElement = undefined;
    }
  }
}