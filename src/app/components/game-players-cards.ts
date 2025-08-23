import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { GameCore } from '../services/game-core';
import { GamePlayerCards } from './game-player-cards';

@Component({
  selector: 'app-game-players-cards',
  imports: [GamePlayerCards],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  template: `
    <swiper-container (swiperslidechange)="onSwiperChange($event)" class="w-full h-[400px]" grab-cursor="true" space-between="140" slides-per-view="3" centered-slides="true">
      @for (item of gameCore.playersWords(); track $index) {
        <swiper-slide class="scale-75 opacity-90 transition-all grayscale-100">
          <app-game-player-cards
            [cards]="item.words"
            [player]="item.player"
            class="items-center justify-center"
          />
            
        </swiper-slide>
      }
    </swiper-container>
  `,
  styles: `
    swiper-slide.swiper-slide-active {
      scale: 1 !important;
      z-index: 10 !important;
      opacity: 1 !important;
      filter: none !important;
    }
  `,
  host: {
    class: 'block w-full'
  }
})
export class GamePlayersCards {
  public gameCore = inject(GameCore);

  public onSwiperChange(event: any) {
    const swiper = event.swiper || event.target.swiper;
    const index = swiper.activeIndex || swiper.realIndex;
    this.gameCore.winnerPlayerWordIndex.set(index);
  }
}
