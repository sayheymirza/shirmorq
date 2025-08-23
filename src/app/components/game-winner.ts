import { Component, input } from '@angular/core';
import { IPlayer, IPlayerWord, IWord } from '../interface/game';
import { Player } from "./player";
import { Card } from './card';

@Component({
  selector: 'app-game-winner',
  imports: [Player, Card],
  template: `
    <app-player 
      name="{{player().name}}"
      avatar="{{player().avatar}}"
      class="z-10 absolute top-4 w-16"
    />

    <app-player 
      name="{{winner().player.name}}"
      avatar="{{winner().player.avatar}}"
      position="top"
      class="z-10 absolute bottom-32 w-16"
    />

    <!-- job word -->
    <app-card
      id="job"
      text="{{job().text}}"
      image="{{job().image}}"
      position="both"
      class="w-[240px] pb-0 absolute -top-[500px] -rotate-12 scale-75 shadow transition-all duration-500 ease-out"
    />

    <!-- winner words -->
     <div id="winner" class="absolute -bottom-[500px] transition-all duration-500 ease-out">
          <app-card 
            text="{{winner().words[0].text}}"
            position="both"
            class="w-[240px] relative -rotate-6 pb-0 scale-75 shadow origin-bottom-left transition-all duration-500 ease-out"
          />
          <app-card 
            text="{{winner().words[1].text}}"
            position="both"
            class="w-[240px] absolute -bottom-16 pb-0 rotate-6 scale-75 shadow origin-bottom-right transition-all duration-500 ease-out"
          />
        
     </div>
  `,
  host: {
    class: 'flex flex-col items-center justify-center transition-all duration-500 ease-out opacity-100'
  }
})
export class GameWinner {
  public job = input.required<IWord>();
  public winner = input.required<IPlayerWord>();
  public player = input.required<IPlayer>();


  ngOnInit() {
    setTimeout(() => {
      this.showWords();
    }, 1000);

    setTimeout(() => {
      this.swipeWords();
    }, 4000);

    setTimeout(() => {
      this.hideWords();
    }, 7000);

    setTimeout(() => {
      this.hide();
    }, 8000);
  }

  private showWords() {
    const jobElement = document.getElementById('job');
    const winnerElement = document.getElementById('winner');

    if (jobElement && winnerElement) {
      jobElement.style.top = '-200px';
      winnerElement.style.bottom = '0px';
    }
  }

  private swipeWords() {
    const jobElement = document.getElementById('job');
    const winnerElement = document.getElementById('winner');

    if (jobElement && winnerElement) {
      jobElement.style.top = 'calc(100dvh - 350px)';
      jobElement.style.rotate = '12deg';
      winnerElement.style.bottom = 'calc(100dvh - 250px)';
      // reverse rotate winner children and reverse origin
      (winnerElement.children[0] as HTMLElement).style.rotate = '3deg';
      (winnerElement.children[0] as HTMLElement).style.transformOrigin = 'top left';
      (winnerElement.children[0] as HTMLElement).style.zIndex = '1';
      (winnerElement.children[1] as HTMLElement).style.rotate = '-3deg';
      (winnerElement.children[1] as HTMLElement).style.transformOrigin = 'top right';
      (winnerElement.children[1] as HTMLElement).style.bottom = '-32px';
    }
  }

  private hideWords() {
    const jobElement = document.getElementById('job');
    const winnerElement = document.getElementById('winner');

    if (jobElement && winnerElement) {
      // change duration to 1500ms
      jobElement.style.transitionDuration = '1500ms';
      winnerElement.style.transitionDuration = '1500ms';

      jobElement.style.top = 'calc(100dvh + 200px)';
      jobElement.style.rotate = '0deg';
      winnerElement.style.bottom = 'calc(100dvh + 200px)';
      // reverse rotate winner children and reverse origin
      (winnerElement.children[0] as HTMLElement).style.rotate = '0deg';
      (winnerElement.children[0] as HTMLElement).style.transformOrigin = 'center';
      (winnerElement.children[0] as HTMLElement).style.zIndex = '0';
      (winnerElement.children[1] as HTMLElement).style.rotate = '0deg';
      (winnerElement.children[1] as HTMLElement).style.transformOrigin = 'center';
      (winnerElement.children[1] as HTMLElement).style.bottom = '0px';
    }
  }

  private hide() {
    // hide host element (parrent job)
    const host = document.querySelector('app-game-winner') as HTMLElement;

    if (host) {
      host.style.opacity = '0';
    }
  }
}
