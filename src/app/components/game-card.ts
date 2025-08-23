import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';
import { IWord } from '../interface/game';
import { NgClass } from '@angular/common';
import { Card } from "./card";

@Component({
  selector: 'app-game-card',
  imports: [NgClass, Card],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  template: `
    <swiper-container class="w-[220px] h-[340px]" effect="cards" grab-cursor="true">
      @for (item of availableWords(); track $index) {
        <swiper-slide 
          (click)="toggle(item)" 
          style="overflow: unset !important; border-radius: 12px;"
        >
          <app-card 
            text="{{item.text}}"
            [selected]="item.type == 'job' ? null : selectedWords().includes(item)"
            class="relative top-0 transition-all"
            [ngClass]="{'!-top-10': selectedWords().includes(item)}"
          />
          
        </swiper-slide>
      }
    </swiper-container>
  `,
  host: {
    class: 'flex items-center justify-center'
  }
})
export class GameCard {
  public availableWords = input<IWord[]>([]);
  public selectedWords = input<IWord[]>([]);
  public selectedWordsChange = output<IWord[]>();

  public toggle(word: IWord) {
    if (word.type == 'job') return;

    if (this.selectedWords().includes(word)) {
      this.selectedWordsChange.emit(
        this.selectedWords().filter((item) => item != word)
      );
    } else {
      if (this.selectedWords().length == 2) return;

      this.selectedWordsChange.emit([
        ...this.selectedWords(),
        word,
      ]);
    }
  }
}
