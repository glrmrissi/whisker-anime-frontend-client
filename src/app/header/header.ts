import { afterNextRender, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Avatar } from '../../../projects/ui/src/public-api';
import { faSun, faMoon, faHouse, faInfoCircle, faEnvelope, faCompass } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { Router } from '@angular/router';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  imports: [Avatar, FaIconComponent, TooltipDirective],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Header {
  private router = inject(Router)
  private headerService = inject(HeaderService)
  private cdr = inject(ChangeDetectorRef)

  baseUrl = 'http://localhost:3001/'

  avatarItem = { src: ``, alt: 'U' };
  logoItem = '/logo.png'
  themeSwitch = false
  dropDownActive = true;
  protected faSun = faSun
  protected faMoon = faMoon
  protected faHouse = faHouse
  protected faInfo = faInfoCircle
  protected faEnvelope = faEnvelope
  protected faCompass = faCompass
  
  constructor() {
    afterNextRender(() => {
        this.getProfile();
    });
}

  redirectToProfile() {
    this.router.navigate(['/profile'])
  }

  async getProfile(): Promise<void> {
    let res = await this.headerService.getUserProfile();
    
    if (!res) return;
    
    const timestamp = new Date().getTime();
    
    const fullAvatarUrl = `${this.baseUrl}${res[0].avatarUrl}?t=${timestamp}`;

    this.avatarItem = {
        ...this.avatarItem,
        src: fullAvatarUrl  
    };

    this.cdr.markForCheck(); 
}

  switchTheme() {
    const isDarkMode = document.documentElement.classList.contains('dark-mode');

    if (isDarkMode) {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'true');
    } else {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'false');
    }
  }
}
