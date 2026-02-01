/**
 * Project Title: Tic-Tac-Toe
 * File: sound.service.ts
 * Description: Procedural audio engine leveraging the Web Audio API. 
 *              Provides low-latency auditory feedback for game interactions 
 *              without the need for external asset loading.
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

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
/**
 * @class SoundService
 * @description Architecture for real-time oscillator-based sound generation.
 * Encapsulates AudioContext management and harmonic frequency orchestration.
 */
export class SoundService {
    private audioCtx: AudioContext | null = null;

    constructor() { }

    /**
   * @method initAudio
   * @description Lazy-initialization of the AudioContext. 
   * Ensures compliance with browser "user-interaction" security policies 
   * for audio playback.
   */
    private initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playClick() {
        this.initAudio();
        this.playTone(600, 0.1, 'sine', 0.1);
    }

    playMoveX() {
        this.initAudio();
        this.playTone(200, 0.2, 'square', 0.05);
        setTimeout(() => this.playTone(400, 0.1, 'sine', 0.05), 50);
    }

    playMoveO() {
        this.initAudio();
        this.playTone(300, 0.2, 'triangle', 0.05);
        setTimeout(() => this.playTone(500, 0.1, 'sine', 0.05), 50);
    }

    playWin() {
        this.initAudio();
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.3, 'sine', 0.1), i * 150);
        });
    }

    playDraw() {
        this.initAudio();
        this.playTone(150, 0.4, 'sawtooth', 0.05);
    }

    /**
   * @method playTone
   * @description Core signal synthesis engine. 
   * Configures an OscillatorNode and GainNode to produce a specific spectral signature.
   * @param freq - Frequency in Hertz.
   * @param duration - Time in seconds before decay.
   * @param type - Oscillator waveform geometry.
   * @param volume - Standardized gain level.
   */
    private playTone(freq: number, duration: number, type: OscillatorType, volume: number) {
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
    }
}
