import { inject, Injectable, signal } from '@angular/core';
import { IMessage } from '../interface/chat';
import { App } from './app';
import { GameCore } from './game-core';

@Injectable({
  providedIn: 'root'
})
export class Chat {
  public message = '';
  public messages = signal<IMessage[]>([]);

  public speaker = signal<boolean>(true);
  public microphone = signal<boolean>(true);

  private gameCore = inject(GameCore);
  private app = inject(App);

  private fadeOutTimeout: any;

  constructor() {
    this.load();
  }

  public load() {
    this.speaker.set(this.app.speaker());
    this.microphone.set(this.app.microphone());
  }

  public toggleSpeaker() {
    this.speaker.set(!this.speaker());
    this.app.speaker.set(this.speaker());
  }

  public toggleMicrophone() {
    this.microphone.set(!this.microphone());
    this.app.microphone.set(this.microphone());
  }

  public sendMessage() {
    if (this.message.length == 0) return;

    this.messages.set([
      {
        player: this.gameCore.players()[0],
        text: this.message,
      },
      ...this.messages(),
    ]);

    setTimeout(() => {
      this.scrollToBottom();
      this.showChatMessages();
    }, 0);

    this.message = '';
  }

  private scrollToBottom() {
    const element = document.querySelector('app-chat-messages')!;
    if (!element) return;
    // smooth scroll to bottom
    element.scrollTo({
      top: element.scrollHeight,
      behavior: 'smooth'
    });
  }

  public toggleChatMessages() {
    const element = document.querySelector('app-chat-messages')!;
    if (!element) return;
    element.classList.toggle('opacity-100');
  }

  public hideChatMessages() {
    const element = document.querySelector('app-chat-messages')!;
    if (!element) return;
    element.classList.remove('opacity-100');
    element.classList.add('opacity-0');
  }

  public showChatMessages() {
    clearTimeout(this.fadeOutTimeout);

    const element = document.querySelector('app-chat-messages')!;
    if (!element) return;

    // remove opacity-0, add opacity-100
    element.classList.remove('opacity-0');
    element.classList.add('opacity-100');

    this.fadeOutTimeout = setTimeout(() => {
      element.classList.remove('opacity-100');
      element.classList.add('opacity-0');
    }, 5000);
  }
}
