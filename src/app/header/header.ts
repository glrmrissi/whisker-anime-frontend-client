import {
  afterNextRender, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, HostListener, inject, signal
} from '@angular/core';
import {
  faHouse, faInfoCircle, faEnvelope, faCompass,
  faBars, faTimes, faPalette, faCheck, faHeart
} from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { Router, RouterLink } from '@angular/router';
import { HeaderService } from './header.service';
import { Avatar, Search } from '../../../projects/ui/src/public-api';
import { ThemeService } from '../../shared/services/theme.service';
import environment from '../../shared/environments/environment.local'

@Component({
  selector: 'app-header',
  imports: [Avatar, Search, FaIconComponent, TooltipDirective, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class Header {
  private router = inject(Router);
  private headerService = inject(HeaderService);
  private cdr = inject(ChangeDetectorRef);
  protected themeService = inject(ThemeService);

  protected avatarItem = signal({ src: '', alt: 'U' });
  protected themePanelOpen = signal(false);
  protected currentThemeId = signal(this.themeService.getCurrentThemeId());
  protected sidebarOpen = signal(false);

  protected readonly themes = this.themeService.themes;

  protected faHouse = faHouse;
  protected faInfo = faInfoCircle;
  protected faEnvelope = faEnvelope;
  protected faCompass = faCompass;
  protected faBars = faBars;
  protected faTimes = faTimes;
  protected faPalette = faPalette;
  protected faCheck = faCheck;
  protected faHeart = faHeart;

  constructor() {
    afterNextRender(() => this.getProfile());
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.theme-picker')) {
      this.themePanelOpen.set(false);
    }
  }

  async getProfile(): Promise<void> {
    const res = await this.headerService.getUserProfile();
    if (!res?.[0]) return;

    const timestamp = Date.now();
    const fullUrl = `${environment}/${res[0].avatarUrl}?t=${timestamp}`;

    this.avatarItem.update(v => ({ ...v, src: fullUrl }));
    this.cdr.markForCheck();
  }

  toggleThemePanel(event: MouseEvent) {
    event.stopPropagation();
    this.themePanelOpen.update(v => !v);
  }

  applyTheme(themeId: string) {
    this.themeService.setTheme(themeId);
    this.currentThemeId.set(themeId);
    this.themePanelOpen.set(false);
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  redirectToProfile() {
    this.router.navigate(['/profile']);
  }
}
