import {
    Component,
    Input,
    signal,
    AfterViewInit,
    OnChanges,
    PLATFORM_ID,
    inject,
    ViewChild,
    ElementRef,
    SimpleChanges
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Card } from '../../../../projects/ui/src/public-api';

export interface AnimeItem {
    link: string;
    canonicalTitle: string;
    coverImage: string;
    subtype: string[];
}

@Component({
    selector: 'app-carousel',
    standalone: true,
    imports: [CommonModule, FaIconComponent, Card],
    template: `
    <div class="carousel-container">
      <small class="see-more-handler" href="">see more</small>
      <button 
        class="carousel-button carousel-button-left" 
        (click)="scrollLeft()"
        [disabled]="scrollPosition() === 0"
      >
        <fa-icon [icon]="faChevronLeft"></fa-icon>
      </button>

      <div class="carousel-wrapper" #carouselWrapper>
        <div 
          class="carousel-track"
          #carouselTrack
          [style.transform]="'translateX(-' + scrollPosition() + 'px)'"
        >
          @for (anime of items; track anime.link) {
            <div class="carousel-item">
              <lib-card [item]="anime"></lib-card>
            </div>
          }
        </div>
      </div>

      <button 
        class="carousel-button carousel-button-right" 
        (click)="scrollRight()"
        [disabled]="isAtEnd()"
      >
        <fa-icon [icon]="faChevronRight"></fa-icon>
      </button>
    </div>
  `,
    styleUrl: './carousel.css'
})
export class Carousel implements AfterViewInit, OnChanges {
    @Input() items: AnimeItem[] = [];
    @Input() itemsPerView = 7;
    @Input() gap = 16;

    @ViewChild('carouselWrapper') carouselWrapper!: ElementRef;
    @ViewChild('carouselTrack') carouselTrack!: ElementRef;

    scrollPosition = signal(0);
    maxScroll = signal(0);

    protected faChevronLeft = faChevronLeft;
    protected faChevronRight = faChevronRight;

    private platformId = inject(PLATFORM_ID);
    private resizeObserver: ResizeObserver | null = null;

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.calculateDimensions();

            this.setupResizeObserver();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['items']) {
            if (!isPlatformBrowser(this.platformId)) {
                return;
            }

            const delay = window.innerWidth < 768 ? 200 : 50;
            setTimeout(() => {
                this.calculateDimensions();
            }, delay);
        }
    }

    private calculateDimensions() {
        if (!this.carouselWrapper || !this.carouselTrack) return;

        requestAnimationFrame(() => {
            const wrapper = this.carouselWrapper.nativeElement as HTMLElement;
            const track = this.carouselTrack.nativeElement as HTMLElement;

            const containerWidth = wrapper.clientWidth;
            const trackWidth = track.scrollWidth;

            const max = Math.max(0, trackWidth - containerWidth);
            this.maxScroll.set(max);
        });
    }

    private setupResizeObserver() {
        if (!this.carouselWrapper || typeof ResizeObserver === 'undefined') return;

        this.resizeObserver = new ResizeObserver(() => {
            this.calculateDimensions();
        });

        this.resizeObserver.observe(this.carouselWrapper.nativeElement);
    }

    scrollLeft() {
        const itemWidth = this.carouselWrapper.nativeElement.clientWidth / this.itemsPerView;
        const newPosition = Math.max(0, this.scrollPosition() - itemWidth);
        this.scrollPosition.set(newPosition);
    }

    scrollRight() {
        const itemWidth = this.carouselWrapper.nativeElement.clientWidth / this.itemsPerView;
        const newPosition = Math.min(this.maxScroll(), this.scrollPosition() + itemWidth);
        this.scrollPosition.set(newPosition);
    }

    isAtEnd(): boolean {
        return this.scrollPosition() >= this.maxScroll() - 10;
    }

    ngOnDestroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }
}