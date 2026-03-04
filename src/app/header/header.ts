import { afterNextRender, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, inject, PLATFORM_ID, signal } from '@angular/core';
import {
  faSun, faMoon, faHouse, faInfoCircle, faEnvelope, faCompass,
  faBars, faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { Router, RouterLink } from '@angular/router';
import { HeaderService } from './header.service';
import { Avatar, Search } from '../../../projects/ui/src/public-api';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    Avatar, Search, FaIconComponent, TooltipDirective, RouterLink
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class Header {
  private router = inject(Router);
  private headerService = inject(HeaderService);
  private cdr = inject(ChangeDetectorRef);
  private platformId: Object = inject(PLATFORM_ID);
  protected avatarItem = signal({ src: '', alt: 'U' });
  protected themeSwitch = signal(false);
  protected sidebarOpen = signal(false);

  protected faSun = faSun;
  protected faMoon = faMoon;
  protected faHouse = faHouse;
  protected faInfo = faInfoCircle;
  protected faEnvelope = faEnvelope;
  protected faCompass = faCompass;
  protected faBars = faBars;
  protected faTimes = faTimes;

  constructor() {
    afterNextRender(() => this.getProfile());

    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'false') {
        document.documentElement.classList.add('dark-mode');
        this.themeSwitch.set(true);
      }
    }
  }

  async getProfile(): Promise<void> {
    const res = await this.headerService.getUserProfile();
    if (!res?.[0]) return;

    const timestamp = Date.now();
    const fullUrl = `http://localhost:3001/${res[0].avatarUrl}?t=${timestamp}`;

    this.avatarItem.update(v => ({ ...v, src: fullUrl }));
    this.cdr.markForCheck();
  }

  switchTheme() {
    const isDark = document.documentElement.classList.toggle('dark-mode');
    this.themeSwitch.set(isDark);
    localStorage.setItem('theme', String(!isDark));
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  redirectToProfile() {
    this.router.navigate(['/profile']);
  }
}