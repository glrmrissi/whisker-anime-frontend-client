import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button, Accordion, Avatar } from '../../projects/ui/src/public-api';
import { Header } from './header/header';
import { Home } from './home/home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Button, Accordion, Avatar, Header, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front-end');
  
  myData = [
    { title: 'Pergunta 1', content: 'Resposta da primeira pergunta.' },
    { title: 'Pergunta 2', content: 'Resposta da segunda pergunta.' }
  ];

  btn = { item: 'Ronaldo' };

  avatarItem = { src: 'https://a.storyblok.com/f/178900/960x540/14906f2269/monogatari-suruga-kanbaru.jpg', alt: 'User Avatar' };

  switchTheme() {
    const root = document.documentElement;
    root.classList.toggle('dark-mode');
  }

}
