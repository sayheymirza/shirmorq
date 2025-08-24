import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class App {
  public music = signal<boolean>(true);
  public sfx = signal<boolean>(true);
  public vibration = signal<boolean>(true);
  public speaker = signal<boolean>(true);
  public microphone = signal<boolean>(true);

  constructor() {
    this.load();

    effect(() => {
      this.save();
    })
  }

  public load() {
    const app = window.localStorage.getItem('#shirmorq/app');

    if (app) {
      const json = JSON.parse(app);

      this.music.set(json['music']);
      this.sfx.set(json['sfx']);
      this.speaker.set(json['speaker']);
      this.microphone.set(json['microphone']);
      this.vibration.set(json['vibration']);
      

      console.log('[services/app.ts] loaded');
    }
  }

  public save() {
    window.localStorage.setItem(
      '#shirmorq/app',
      JSON.stringify({
        'music': this.music(),
        'sfx': this.sfx(),
        'speaker': this.speaker(),
        'microphone': this.microphone(),
        'vibration': this.vibration(),
      })
    );

    console.log('[services/app.ts] saved');
  }
}
