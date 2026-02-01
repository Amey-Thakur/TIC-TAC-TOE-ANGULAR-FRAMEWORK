/**
 * Project Title: Tic-Tac-Toe
 * File: app.component.ts
 * Description: Root component of the Tic-Tac-Toe application. Orchestrates global 
 *              security policies, anti-inspection measures, and the system easter egg.
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

import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet]
})
/**
 * @class AppComponent
 * @description Serves as the high-level application controller.
 * Responsible for enforcing production safety measures and initializing global services.
 */
export class AppComponent implements OnInit {
  title = 'TIC-TAC-TOE | AMEY & MEGA';

  ngOnInit() {
    this.printEasterEgg();
  }

  /**
   * @method onContextMenu
   * @description Global event listener to sequester the right-click context menu,
   * enforcing a "native-application" feel and preventing basic source inspection.
   */
  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  /**
   * @method onKeyDown
   * @description Low-level keyboard event interceptor. 
   * Specifically targets and neutralizes common browser developer shortcuts 
   * (F12, Inspection suites, and View Source) to maintain environment integrity.
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (
      event.key === 'F12' ||
      (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J')) ||
      (event.ctrlKey && event.key === 'U')
    ) {
      event.preventDefault();
    }
  }

  /**
   * @method printEasterEgg
   * @description Private initialization logic that broadcasts a scholarly attribution 
   * to the browser console, utilizing CSS-styled log outputs for visibility.
   */
  private printEasterEgg() {
    const titleStyle = 'background: linear-gradient(90deg, #4f46e5, #ec4899); color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 8px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);';
    const subStyle = 'color: #38bdf8; font-size: 16px; font-weight: bold; margin-top: 10px;';
    const authorStyle = 'color: #f472b6; font-size: 16px; font-weight: bold; text-decoration: underline;';
    const msgStyle = 'color: #94a3b8; font-size: 14px; font-style: italic;';

    setTimeout(() => {
      console.log('%c 🚀 TIC-TAC-TOE ULTIMATE V21 ', titleStyle);
      console.log('%cDeveloped by %cAmey Thakur %c& %cMega Satish', subStyle, authorStyle, 'color: #38bdf8', authorStyle);
      console.log('%c"Building the future of gaming, one square at a time."', msgStyle);
      console.log('%c------------------------------------------------', 'color: #334155');
    }, 1000);
  }
}
