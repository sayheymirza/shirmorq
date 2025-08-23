import { Component, input } from '@angular/core';
import { IPlayer, IWord } from '../interface/game';
import { Card } from './card';
import { Player } from './player';

@Component({
  selector: 'app-game-player-cards',
  imports: [Card, Player],
  template: `
    <div class="relative scale-75 h-80">
      @if(cards().length == 2) {
      <app-card 
        text="{{cards()[0].text}}"
        class="w-[200px] h-[330px] -rotate-6 shadow-lg origin-bottom-left"
      />
      <app-card 
        text="{{cards()[1].text}}"
        class="w-[200px] h-[330px] absolute -bottom-16 rotate-6 shadow-lg origin-bottom-right"
      />
      }
    </div>
  
    <app-player 
      name="{{player().name}}"
      avatar="{{player().avatar}}"
      class="z-10 w-16"
    />
  `,
  host: {
    class: 'flex flex-col items-center gap-4'
  }
})
export class GamePlayerCards {
  public cards = input.required<IWord[]>();
  public player = input.required<IPlayer>();
}
