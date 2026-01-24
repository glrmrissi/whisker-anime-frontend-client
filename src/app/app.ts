import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button, Card, Accordion, Avatar } from '../../projects/ui/src/public-api';
import { Header } from './header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Button, Accordion, Avatar, Card, Header],
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

  cardItem = {
    image: 'https://a.storyblok.com/f/178900/960x540/14906f2269/monogatari-suruga-kanbaru.jpg',
    title: 'Sample Card Title',
    description: 'This is a description for the sample card. It provides brief details about the content of the card.',
    link: 'https://example.com',
    tag: ['Terror'],
  };

  switchTheme() {
    const root = document.documentElement;
    root.classList.toggle('dark-mode');
  }

}
