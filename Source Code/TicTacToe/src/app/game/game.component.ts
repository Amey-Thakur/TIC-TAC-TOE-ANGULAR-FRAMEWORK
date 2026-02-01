/**
 * Project Title: Tic-Tac-Toe
 * File: game.component.ts
 * Description: Core game engine and state controller. Manages reactivity via Angular Signals,
 *              handles turn-based logic, evaluates win conditions, and orchestrates 
 *              cinematic post-game sequences.
 *
 * Authors:
 *   - Amey Thakur — https://github.com/Amey-Thakur
 *   - Mega Satish — https://github.com/msatmod
 *
 * Repository:
 *   https://github.com/Amey-Thakur/TIC-TAC-TOE
 *
 * Live Application:
 *   https://amey-thakur.github.io/TIC-TAC-TOE/
 *
 * Video Demonstration:
 *   https://youtu.be/zCKgLImSjeo
 *
 * Release Date:
 *   June 13, 2022
 *
 * License:
 *   MIT License
 *
 * Copyright (c) 2022 Amey Thakur & Mega Satish
 */

import { Component, OnInit, signal, computed } from '@angular/core';
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
/**
 * @class GameComponent
 * @description State-driven component leveraging Angular's fine-grained reactivity.
 * Implements a 3x3 grid logic with automatic resolution for victory/draw states.
 */
export class GameComponent implements OnInit {
  squares = signal<('X' | 'O' | undefined)[]>(Array(9).fill(undefined));
  xIsNext = signal<boolean>(true);
  winner = signal<'X' | 'O' | null>(null);
  counter = signal<number>(0);
  isDraw = signal<boolean>(false);
  freshPage = signal<boolean>(true);
  loading = signal<boolean>(true);
  loadingProgress = signal<number>(0);
  showCard = signal<boolean>(false);
  winningIndices = signal<number[]>([]);
  gameConcluding = signal<boolean>(false); // NEW: Controls the cinematic pause

  /**
   * @property player
   * @description Computed signal that derives the current active player symbol.
   * Ensures data consistency between turns.
   */
  player = computed(() => (this.xIsNext() ? 'X' : 'O') as 'X' | 'O');

  constructor(private soundService: SoundService) { }

  ngOnInit(): void {
    this.simulateLoading();
  }

  simulateLoading() {
    const duration = 2500;
    const intervalTime = 50;
    const increment = (100 / (duration / intervalTime));

    const progressInterval = setInterval(() => {
      this.loadingProgress.update(p => {
        const next = p + increment;
        if (next >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => this.loading.set(false), 500);
          return 100;
        }
        return next;
      });
    }, intervalTime);
  }



  toggleShareCard() {
    this.soundService.playClick();
    this.showCard.update(s => !s);
  }

  async copyResult() {
    const resText = this.winner() ? 'Player ' + this.winner() + ' Won!' : 'It was a Draw!';
    const text = `🎮 Tic-Tac-Toe\n\n🏆 Result: ${resText} \n🔥 Unbeatable Match!\n\n🔴 Play Live: https://amey-thakur.github.io/TIC-TAC-TOE/\n\nCreated by Amey Thakur & Mega Satish`;
    try {
      this.soundService.playClick();
      await navigator.clipboard.writeText(text);
      alert('Result copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  async shareResult() {
    const resText = this.winner() ? 'Player ' + this.winner() + ' Won!' : 'It was a Draw!';
    const data = {
      title: 'Tic-Tac-Toe Result',
      text: `🎮 Tic-Tac-Toe\n\n🏆 Result: ${resText} \n🔥 Unbeatable Match!\n\nCreated by Amey Thakur & Mega Satish`,
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


  // Signals handle reactivity automatically

  /**
   * @method makeMove
   * @description Central event handler for user interaction. 
   * Orchestrates move validation, state updates, sound triggers, and game resolution status.
   * @param idx - The index of the square being targeted (0-8).
   */
  makeMove(idx: number) {
    if (this.winner() || this.isDraw() || this.gameConcluding()) return;
    if (!this.squares()[idx]) {
      const currentPlayer = this.player();
      this.squares.update(s => {
        const newSquares = [...s];
        newSquares[idx] = currentPlayer;
        return newSquares;
      });

      if (currentPlayer === 'X') {
        this.soundService.playMoveX();
      } else {
        this.soundService.playMoveO();
      }

      this.xIsNext.update(x => !x);
      this.counter.update(c => c + 1);
    }

    const win = this.calculateWinner();
    this.winner.set(win);

    if (win || this.counter() == 9) {
      this.gameConcluding.set(true); // Trigger animations

      if (win) {
        this.soundService.playWin();
      } else {
        this.isDraw.set(true);
        this.soundService.playDraw();
      }

      // Cinematic pause before showing the post-game UI
      setTimeout(() => {
        this.gameConcluding.set(false);
      }, 1500);
    }
  }

  /**
   * @method calculateWinner
   * @description Implementation of the core win-condition evaluation strategy.
   * Iterates through pre-defined combinatorial victory paths to determine match resolution.
   * @returns The winning symbol ('X' or 'O') or null if no winner exists.
   */
  calculateWinner() {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      const squares = this.squares();
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        this.winningIndices.set([a, b, c]);
        return squares[a];
      }
    }
    return null
  }

  newGame() {
    this.soundService.playClick();
    this.squares.set(Array(9).fill(undefined));
    this.winner.set(null);
    this.isDraw.set(false);
    this.counter.set(0);
    this.freshPage.set(false);
    this.showCard.set(false);
    this.winningIndices.set([]);
    this.gameConcluding.set(false);
  }
}