import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Theme {
  id: string;
  name: string;
  dark: boolean;
  accent: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isBrowser: boolean;
  private readonly THEME_KEY = 'selected-theme';
  private readonly DEFAULT_THEME = 'light';

  readonly themes: Theme[] = [
    { id: 'light',                      name: 'Light',                dark: false, accent: '#643bfa' },
    { id: 'dark-mode',                  name: 'Dark',                 dark: true,  accent: '#fcd93d' },
    { id: 'theme-tokyo-night',          name: 'Tokyo Night',          dark: true,  accent: '#7aa2f7' },
    { id: 'theme-catppuccin-latte',     name: 'Catppuccin Latte',     dark: false, accent: '#8839ef' },
    { id: 'theme-catppuccin-frappe',    name: 'Catppuccin Frappé',    dark: true,  accent: '#ca9ee6' },
    { id: 'theme-catppuccin-macchiato', name: 'Catppuccin Macchiato', dark: true,  accent: '#c6a0f6' },
    { id: 'theme-catppuccin-mocha',     name: 'Catppuccin Mocha',     dark: true,  accent: '#cba6f7' },
    { id: 'theme-gruvbox',              name: 'Gruvbox Material',     dark: true,  accent: '#d8a657' },
    { id: 'theme-github-dark',          name: 'GitHub Dark',          dark: true,  accent: '#58a6ff' },
    { id: 'theme-rose-pine',            name: 'Rose Pine',            dark: true,  accent: '#c4a7e7' },
    { id: 'theme-one-dark',             name: 'One Dark Pro',         dark: true,  accent: '#61afef' },
    { id: 'theme-dracula',              name: 'Dracula',              dark: true,  accent: '#bd93f9' },
    { id: 'theme-nord',                 name: 'Nord',                 dark: true,  accent: '#88c0d0' },
    { id: 'theme-kanagawa',             name: 'Kanagawa',             dark: true,  accent: '#7aa89f' },
    { id: 'theme-night-owl',            name: 'Night Owl',            dark: true,  accent: '#82aaff' },
  ];

  private readonly allThemeClasses = this.themes
    .map(t => t.id)
    .filter(id => id !== 'light');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  loadTheme(): void {
    if (!this.isBrowser) return;

    const legacy = localStorage.getItem('theme');
    if (legacy !== null && !localStorage.getItem(this.THEME_KEY)) {
      const migrated = legacy === 'false' ? 'dark-mode' : 'light';
      localStorage.setItem(this.THEME_KEY, migrated);
      localStorage.removeItem('theme');
    }

    const saved = localStorage.getItem(this.THEME_KEY) ?? this.DEFAULT_THEME;
    this.applyTheme(saved);
  }

  setTheme(themeId: string): void {
    if (!this.isBrowser) return;
    this.applyTheme(themeId);
    localStorage.setItem(this.THEME_KEY, themeId);
  }

  getCurrentThemeId(): string {
    if (!this.isBrowser) return this.DEFAULT_THEME;
    return localStorage.getItem(this.THEME_KEY) ?? this.DEFAULT_THEME;
  }

  isDarkMode(): boolean {
    if (!this.isBrowser) return false;
    const current = this.getCurrentThemeId();
    return this.themes.find(t => t.id === current)?.dark ?? false;
  }

  isLightMode(): boolean {
    return !this.isDarkMode();
  }

  private applyTheme(themeId: string): void {
    document.documentElement.classList.remove(...this.allThemeClasses);
    if (themeId !== 'light') {
      document.documentElement.classList.add(themeId);
    }
  }
}
