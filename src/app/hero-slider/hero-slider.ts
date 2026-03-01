import { Component, OnInit, OnDestroy, Input, signal, computed, inject, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faInfoCircle, faFire, faPlayCircle, faStopCircle, faPlay } from '@fortawesome/free-solid-svg-icons';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { Router } from '@angular/router';
import { SkeletonDirective } from '../../directives/skeleton.directive';

export interface HeroSlide {
  id: number;
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
  imports: [CommonModule, FaIconComponent, TooltipDirective, SkeletonDirective],
  templateUrl: './hero-slider.html',
  styleUrl: './hero-slider.css'
})
export class HeroSliderComponent implements OnInit, OnDestroy {

  private router = inject(Router);

  @Input() slides: HeroSlide[] = [];
  @Input() autoPlayInterval = 6000;

  isLoading: any = signal(true);

  currentIndex = signal(0);

  currentSlide = computed(() => this.slides[this.currentIndex()]);

  sliderTransform = computed(() => `translateX(-${this.currentIndex() * 100}%)`);

  private timer: ReturnType<typeof setInterval> | null = null;

  protected btnStop = false
  protected faInfoCircle = faInfoCircle
  protected faFire = faFire
  protected faPlayCircle = faPlayCircle
  protected faStopCircle = faStopCircle
  protected faPlay = faPlay

  ngOnInit(): void 
  {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1500);
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

  openDialog(anime: any): void {
    const urlTree = this.router.createUrlTree(['/anime', anime]);
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_self');
  }
}