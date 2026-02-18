import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isBrowser: boolean;
  private readonly DARK_MODE_CLASS = 'dark-mode';
  private readonly THEME_KEY = 'theme';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  loadTheme(): void {
    if (!this.isBrowser) {
      return;
    }

    const theme = localStorage.getItem(this.THEME_KEY);
    const isDarkMode = theme !== 'true';

    if (isDarkMode) {
      document.documentElement.classList.add(this.DARK_MODE_CLASS);
    } else {
      document.documentElement.classList.remove(this.DARK_MODE_CLASS);
    }
  }

  toggleTheme(): boolean {
    if (!this.isBrowser) {
      return false;
    }

    const isDarkMode = document.documentElement.classList.contains(this.DARK_MODE_CLASS);

    if (isDarkMode) {
      document.documentElement.classList.remove(this.DARK_MODE_CLASS);
      localStorage.setItem(this.THEME_KEY, 'true'); 
      return false; 
    } else {
      document.documentElement.classList.add(this.DARK_MODE_CLASS);
      localStorage.setItem(this.THEME_KEY, 'false');
      return true; 
    }
  }

  setTheme(isDarkMode: boolean): void {
    if (!this.isBrowser) {
      return;
    }

    if (isDarkMode) {
      document.documentElement.classList.add(this.DARK_MODE_CLASS);
      localStorage.setItem(this.THEME_KEY, 'false');
    } else {
      document.documentElement.classList.remove(this.DARK_MODE_CLASS);
      localStorage.setItem(this.THEME_KEY, 'true');
    }
  }

  isDarkMode(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    return document.documentElement.classList.contains(this.DARK_MODE_CLASS);
  }

  isLightMode(): boolean {
    return !this.isDarkMode();
  }
}