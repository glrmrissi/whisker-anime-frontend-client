import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Avatar } from '../../../projects/ui/src/public-api';
import { faSun, faMoon, faHouse, faInfoCircle, faEnvelope, faCompass } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from '../../shared/services/storage.service';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [Avatar, FaIconComponent, TooltipDirective],
  templateUrl: './header.html',
  styleUrl: './header.css',
})

export class Header {
  private router = inject(Router)

  avatarItem = { src: 'https://a.storyblok.com/f/178900/960x540/14906f2269/monogatari-suruga-kanbaru.jpg', alt: 'User Avatar' };
  logoItem = '/logo.svg'
  themeSwitch = false
  dropDownActive = true;
  protected faSun = faSun
  protected faMoon = faMoon
  protected faHouse = faHouse
  protected faInfo = faInfoCircle
  protected faEnvelope = faEnvelope
  protected faCompass = faCompass

  redirectToProfile() {
    this.router.navigate(['/profile'])
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
