import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css'],
    imports: [NgIf]
})
export class BoardComponent implements OnInit {
  @Input() value: 'X' | 'O' | undefined
  constructor() { }

  ngOnInit(): void {
  }

}
