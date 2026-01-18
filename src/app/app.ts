import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Inputs } from './g-components/inputs/inputs';
import { Button } from '../../projects/ui/src/public-api';
import { Accordion } from '../../projects/ui/src/public-api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Inputs, Button, Accordion],
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

  switchTheme() {
    const root = document.documentElement;
    root.classList.toggle('dark-mode');
  }
}
