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
  private hideTimeout?: ReturnType<typeof setTimeout>;
  private showTimeout?: ReturnType<typeof setTimeout>;
  
  @HostListener('mouseenter')
  onMouseEnter() {
    // Cancela qualquer hide pendente
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
    
    // Pequeno delay antes de mostrar (evita flicker em movimento rápido)
    this.showTimeout = setTimeout(() => {
      this.show();
    }, 50);
  }
  
  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = undefined;
    }
    
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, 50);
  }
  
  ngOnDestroy() {
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
    if (this.showTimeout) clearTimeout(this.showTimeout);
    this.hide();
  }
  
  private show() {
    if (!this.appTooltip) return;
    
    if (this.tooltipElement) return;
    
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.className = `tooltip tooltip-${this.position}`;
    this.tooltipElement.textContent = this.appTooltip;
    
    this.tooltipElement.style.cssText = `
      position: fixed;
      background: #333;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 10000;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease-in-out;
    `;
    
    document.body.appendChild(this.tooltipElement);
    
    void this.tooltipElement.offsetHeight;
    
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.positionTooltip(rect);
    
    requestAnimationFrame(() => {
      if (this.tooltipElement) {
        this.tooltipElement.style.opacity = '1';
      }
    });
  }
  
  private positionTooltip(rect: DOMRect) {
    if (!this.tooltipElement) return;
    
    const offset = 10;
    let top = 0;
    let left = 0;
    
    requestAnimationFrame(() => {
      if (!this.tooltipElement) return;
      
      const tooltipRect = this.tooltipElement.getBoundingClientRect();
      const tooltipWidth = tooltipRect.width;
      const tooltipHeight = tooltipRect.height;
      
      switch (this.position) {
        case 'top':
          top = rect.top - tooltipHeight - offset;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'bottom':
          top = rect.bottom + offset;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.left - tooltipWidth - offset;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + offset;
          break;
      }
      
      if (left < 0) left = 10;
      if (left + tooltipWidth > window.innerWidth) {
        left = window.innerWidth - tooltipWidth - 10;
      }
      if (top < 0) top = 10;
      
      this.tooltipElement!.style.top = top + 'px';
      this.tooltipElement!.style.left = left + 'px';
    });
  }
  
  private hide() {
    if (!this.tooltipElement) return;
    
    this.tooltipElement.style.opacity = '0';
    
    setTimeout(() => {
      if (this.tooltipElement) {
        this.tooltipElement.remove();
        this.tooltipElement = undefined;
      }
    }, 150);
  }
}