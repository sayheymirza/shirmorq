import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChatMessages } from "../components/chat-messages";
import { GameCard } from "../components/game-card";
import { GameFooter } from "../components/game-footer";
import { GameHeader } from "../components/game-header";
import { GamePlayerCards } from "../components/game-player-cards";
import { GamePlayersCards } from "../components/game-players-cards";
import { GameWinner } from "../components/game-winner";
import { Chat } from '../services/chat';
import { GameCore } from '../services/game-core';

@Component({
  selector: 'app-game',
  imports: [GameFooter, GameCard, GameHeader, NgClass, ChatMessages, GamePlayerCards, GamePlayersCards, GameWinner],
  template: `
    @if(gameCore.view() == 'choosing-word' && gameCore.selectedWords().length != 0) {
      <div class="flex flex-col items-center justify-center p-4 absolute top-20 left-1/2 -translate-x-1/2">
        <span class="text-gray-600">کالای شما</span>
        <strong class="text-3xl">
          {{productWord()}}
        </strong>
      </div>
    }
    

    @if(gameCore.timer().length != 0) {
      <div (click)="gameCore.showViewMessage()" class="flex flex-col items-center justify-center gap-1 absolute top-20 right-7 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24"/></g><g><g><g><path d="M15,1H9v2h6V1z M11,14h2V8h-2V14z M19.03,7.39l1.42-1.42c-0.43-0.51-0.9-0.99-1.41-1.41l-1.42,1.42 C16.07,4.74,14.12,4,12,4c-4.97,0-9,4.03-9,9s4.02,9,9,9s9-4.03,9-9C21,10.88,20.26,8.93,19.03,7.39z M12,20c-3.87,0-7-3.13-7-7 s3.13-7,7-7s7,3.13,7,7S15.87,20,12,20z"/></g></g></g></svg>
        <span class="block text-center">{{gameCore.timer()}}</span>
      </div>
    }

    @if(!['picking-job', 'winner'].includes(gameCore.view()) && gameCore.jobWord() != null) {
      <app-game-header 
        class="absolute top-0 left-1/2 -translate-x-1/2 z-50"
        [word]="gameCore.jobWord()!"
        [player]="gameCore.players()[0]"
      />
    }

    @if(gameCore.message().length != 0) {
      <div class="absolute -top-20 left-20 right-20 snackbar transition-all duration-500 ease-out"
        [ngClass]="{
          'top-4 opacity-100': gameCore.visableMessage(),
        }"
      >
          <span>{{gameCore.message()}}</span>
      </div>
    }

    @if(gameCore.view() == 'picking-word' || gameCore.view() == 'picking-job') {
      <app-game-card 
        class="absolute bottom-10 left-0 right-0" 
        [availableWords]="gameCore.availableWords()"
        [(selectedWords)]="gameCore.selectedWords"
      />
    }

    @if(gameCore.view() == 'discussing-word' && gameCore.availablePlayer() != null) {
      <div
        class="absolute top-1/2 left-1/2 -translate-1/2"
      >
        <app-game-player-cards
          [cards]="gameCore.selectedWords()"
          [player]="gameCore.availablePlayer()!"
          class="animate__bounceIn"
        />
      </div>
    }

    @if(gameCore.view() == 'choosing-word') {
      <div class="absolute top-1/2 left-0 right-0 -translate-y-1/2">
        <app-game-players-cards />
      </div>
    }

    @if(gameCore.view() == 'winner' && gameCore.winnerPlayerCards() != null) {
      <app-game-winner 
        class=" absolute inset-0"
        [job]="gameCore.jobWord()!"
        [winner]="gameCore.winnerPlayerCards()!"
        [player]="gameCore.players()[0]"
      />
    }

    @if(gameCore.chatable()) {
      <div class="absolute bottom-32 left-4 z-50">
        <button (click)="toggleChat()" class="btn btn-icon btn-white animate__bounceIn">
          <img src="/chat.png" alt="Chat Icon" class="w-6 h-6 z-1" />
        </button>
      </div>
    }

    @if(chat.messages().length != 0) {
      <app-chat-messages 
        class=" bg-gradient-to-t from-black/40 to-transparent absolute left-0 right-0 bottom-24 z-0 transition-all duration-700 opacity-0"
      />
    }

    <app-game-footer 
      class="absolute bottom-0 left-0 right-0 z-10"
    />
  `,
  host: {
    class: 'block relative h-full'
  }
})
export class Game {
  public gameCore = inject(GameCore);
  public chat = inject(Chat);
  private router = inject(Router);

  public productWord = computed(() => {
    return this.gameCore.selectedWords().map((item) => item.text).join(' ');
  });

  ngOnInit() {
    this.initSession();

    this.gameCore.event.subscribe((event) => {
      console.log(event);

      if (event.event === 'discussing-player-word-ended') {
        this.gameCore.changeView('choosing-word', 60);
      }

      if (event.event == 'winner-player-word-chosen') {
        this.gameCore.changeView('winner', 30);
      }
    });
  }

  public toggleChat() {
    if (!this.gameCore.chatable()) return;

    if (this.gameCore.chating()) {
      this.chat.hideChatMessages();
    } else {
      this.chat.showChatMessages();
    }

    this.gameCore.chating.set(!this.gameCore.chating());
  }

  private async initSession() {
    if (!this.gameCore.load()) {
      this.router.navigate(['/'], { replaceUrl: true });

    }

    await this.gameCore.changeView('picking-job', 10);
    await this.gameCore.changeView('waiting-word', 5);
    this.gameCore.playersWords.set([
      {
        words: [
          {
            type: 'word',
            text: 'خیار'
          },
          {
            type: 'word',
            text: 'پلاستیکی'
          },
        ],
        player: this.gameCore.players()[1],
      },
      {
        words: [
          {
            type: 'word',
            text: 'خیار'
          },
          {
            type: 'word',
            text: 'کپکی'
          },
        ],
        player: this.gameCore.players()[2],
      },
      {
        words: [
          {
            type: 'word',
            text: 'خیار'
          },
          {
            type: 'word',
            text: 'کلفت'
          },
        ],
        player: this.gameCore.players()[3],
      },
    ]);
    await this.gameCore.changeView('discussing-word', this.gameCore.playersWords().length * 20);

    // this.gameCore.changeView('unknown');

    // setTimeout(() => {
    //   this.gameCore.changeView('picking-job', 20);
    // }, 2000);

    // setTimeout(() => {
    //   this.gameCore.changeView('waiting-word', 60 * 1);
    // }, 2000 + 20000);

    // setTimeout(() => {
    //   this.gameCore.changeView('discussing-word', 60 * 2);
    // }, 2000 + 20000 + 60000);

    // setTimeout(() => {
    //   this.gameCore.changeView('choosing-word');
    // }, 2000 + 20000 + (60000 * 3));

    // setTimeout(() => {
    //   this.gameCore.changeView('winner');
    // }, 2000 + 20000 + (60000 * 4));


    // setTimeout(() => {
    //   this.gameCore.changeView('discussing-job');
    // }, 2000 + 10000);
  }
}
