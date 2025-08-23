import { Component, input } from '@angular/core';
import { IPlayer } from '../interface/game';
import { Player } from "./player";

@Component({
  selector: 'app-game-players',
  imports: [Player],
  template: `
    <div class="flex flex-col gap-2">
      @for (item of players(); track $index) {
        <app-player 
          name={{item.name}}
          avatar="{{item.avatar}}"
          position="right"
        />
      }
    </div>
  `,
  host: {
    class: 'flex flex-col'
  }
})
export class GamePlayers {
  public players = input<IPlayer[]>([]);
}
