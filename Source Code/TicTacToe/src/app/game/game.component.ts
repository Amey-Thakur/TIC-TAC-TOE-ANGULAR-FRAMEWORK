import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import { DecimalPipe } from '@angular/common';
import { BoardComponent } from '../board/board.component';
import { SoundService } from '../sound.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  imports: [BoardComponent, DecimalPipe]
})
export class GameComponent implements OnInit {

  squares: any = [];
  xIsNext = true;
  winner = '';
  counter = 0;
  isDraw = '';
  freshPage = true;
  loading = true;
  loadingProgress = 0;
  showCard = false;

  constructor(private soundService: SoundService) { }

  ngOnInit(): void {
    this.simulateLoading();
  }

  simulateLoading() {
    const duration = 2500;
    const intervalTime = 50;
    const increment = (100 / (duration / intervalTime));

    const progressInterval = setInterval(() => {
      this.loadingProgress += increment;
      if (this.loadingProgress >= 100) {
        this.loadingProgress = 100;
        clearInterval(progressInterval);
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }
    }, intervalTime);
  }



  toggleShareCard() {
    this.soundService.playClick();
    this.showCard = !this.showCard;
  }

  async copyResult() {
    const text = `🎮 Tic-Tac-Toe\n\n🏆 Result: ${this.winner ? 'Player ' + this.winner + ' Won!' : 'It was a Draw!'} \n🔥 Unbeatable Match!\n\n🔴 Play Live: https://amey-thakur.github.io/TIC-TAC-TOE/\n\nCreated by Amey Thakur & Mega Satish`;
    try {
      this.soundService.playClick();
      await navigator.clipboard.writeText(text);
      alert('Result copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  async shareResult() {
    const data = {
      title: 'Tic-Tac-Toe Result',
      text: `🎮 Tic-Tac-Toe\n\n🏆 Result: ${this.winner ? 'Player ' + this.winner + ' Won!' : 'It was a Draw!'} \n🔥 Unbeatable Match!\n\nCreated by Amey Thakur & Mega Satish`,
      url: 'https://amey-thakur.github.io/TIC-TAC-TOE/'
    };

    if (navigator.share) {
      try {
        this.soundService.playClick();
        await navigator.share(data);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      this.copyResult();
    }
  }

  downloadCard() {
    this.soundService.playClick();
    const element = document.querySelector('.share-card') as HTMLElement;
    if (element) {
      // Temporarily hide buttons for the screenshot
      const buttons = element.querySelector('.action-buttons') as HTMLElement;
      const hint = element.querySelector('.close-hint') as HTMLElement;

      if (buttons) buttons.style.display = 'none';
      if (hint) hint.style.display = 'none';

      html2canvas(element, { backgroundColor: null, scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `tic-tac-toe-result-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Restore visibility
        if (buttons) buttons.style.display = 'flex';
        if (hint) hint.style.display = 'block';
      });
    }
  }

  get player() {
    return this.xIsNext ? 'X' : 'O'
  }

  winningIndices: number[] = [];

  makeMove(idx: number) {
    if (!this.squares[idx]) {
      const currentPlayer = this.player;
      this.squares.splice(idx, 1, currentPlayer)

      if (currentPlayer === 'X') {
        this.soundService.playMoveX();
      } else {
        this.soundService.playMoveO();
      }

      this.xIsNext = !this.xIsNext;
      this.counter++;
    }
    this.winner = this.calculateWinner();

    if (this.winner) {
      this.soundService.playWin();
    } else if (this.counter == 9) {
      this.isDraw = 'yes'
      this.soundService.playDraw();
    }
  }

  calculateWinner() {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (this.squares[a] && this.squares[a] === this.squares[b] && this.squares[a] === this.squares[c]) {
        this.winningIndices = [a, b, c]; // Store winning indices
        return this.squares[a];
      }
    }
    return null
  }

  newGame() {
    this.soundService.playClick();
    this.squares = Array(9).fill(null);
    this.winner = '';
    this.isDraw = '';
    this.counter = 0;
    this.freshPage = false;
    this.showCard = false;
    this.winningIndices = [];
  }
}