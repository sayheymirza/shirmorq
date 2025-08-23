import { NgClass } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { IPlayer, IWord } from '../interface/game';
import { Card } from "./card";
import { Player } from "./player";

@Component({
  selector: 'app-game-header',
  imports: [Card, Player, NgClass],
  template: `
  <div
    class="absolute transition-all"
    [ngClass]="{
      '-top-[200px] -rotate-12 scale-75 shadow': small(),
      'top-[100px] z-50 shadow-2xl': !small(),
    }"
  >

    <app-card 
      text="{{word().text}}"
      image="{{word().image}}"
      position="bottom"
      class="w-[240px] pb-0 animate__bounceInDown"
      (click)="small.set(!small())"
      />
    </div>

    <app-player 
      name="{{player().name}}"
      avatar="{{player().avatar}}"
      class="z-10 mt-4"
    />
  `,
  host: {
    class: 'block flex items-center justify-center'
  }
})
export class GameHeader {
  public small = signal<boolean>(true);
  public word = input.required<IWord>();
  public player = input.required<IPlayer>();
}
