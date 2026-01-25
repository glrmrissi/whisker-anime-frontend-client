import { Component } from '@angular/core';
import { Avatar } from '../../../projects/ui/src/public-api';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [Avatar],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  avatarItem = { src: 'https://a.storyblok.com/f/178900/960x540/14906f2269/monogatari-suruga-kanbaru.jpg', alt: 'User Avatar' };
  logoItem = { src: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Crunchyroll_logo_2012v.png', alt: 'Logo' }
  dropDownActive = true;

  showDropDown() {
    this.dropDownActive = !this.dropDownActive;
  }

  switchTheme() {
    const root = document.documentElement;
    root.classList.toggle('dark-mode');
  }
}
