import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SoundService {
    private audioCtx: AudioContext | null = null;

    constructor() { }

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
