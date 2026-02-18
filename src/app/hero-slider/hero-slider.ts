import { Component, OnInit, OnDestroy, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faInfoCircle, faFire, faPlayCircle, faStopCircle } from '@fortawesome/free-solid-svg-icons';
import { TooltipDirective } from '../../directives/tooltip.directive';

export interface HeroSlide {
  badgeText: string;
  title: string;
  rating: number;
  subtype: string;
  year: number;
  description: string;
  backgroundUrl: string;
}

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [CommonModule, FaIconComponent, TooltipDirective],
  templateUrl: './hero-slider.html',
  styleUrl: './hero-slider.css'
})
export class HeroSliderComponent implements OnInit, OnDestroy {

  @Input() slides: HeroSlide[] = [];
  @Input() autoPlayInterval = 6000;

  currentIndex = signal(0);

  currentSlide = computed(() => this.slides[this.currentIndex()]);

  sliderTransform = computed(() => `translateX(-${this.currentIndex() * 100}%)`);

  private timer: ReturnType<typeof setInterval> | null = null;

  protected btnStop = false
  protected faInfoCircle = faInfoCircle
  protected faFire = faFire
  protected faPlayCircle = faPlayCircle
  protected faStopCircle = faStopCircle

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  goToSlide(index: number): void {
    this.currentIndex.set(index);
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  protected startAutoPlay(): void {
    this.btnStop = false
    this.timer = setInterval(() => {
      this.currentIndex.update(i => (i + 1) % this.slides.length);
    }, this.autoPlayInterval);
  }

  protected stopAutoPlay(): void {
    this.btnStop = true
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}