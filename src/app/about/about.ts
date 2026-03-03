import { Component, OnInit } from '@angular/core';
import { Header } from '../header/header';

@Component({
  selector: 'app-about',
  imports: [Header],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class About implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
