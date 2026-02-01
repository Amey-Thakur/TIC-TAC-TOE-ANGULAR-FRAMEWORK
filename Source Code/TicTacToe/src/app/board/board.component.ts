import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  imports: []
})
export class BoardComponent implements OnInit {
  @Input() value: 'X' | 'O' | undefined;
  @Input() isWinning: boolean = false;
  @Input() isSnapshot: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
