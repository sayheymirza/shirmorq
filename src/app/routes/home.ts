import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from "../components/player";
import { GameCore } from '../services/game-core';

@Component({
  selector: 'app-home',
  imports: [Player],
  template: `
    <div class="absolute top-32 text-center">
      <h3 class="text-6xl text-shadow-md text-shadow-white">شیر مرغ</h3>
      <span class="text-shadow-2xs text-shadow-white">نسخه صفر تا صد</span>
    </div>

    <div class="absolute bottom-56">
      @if(gameCore.finding()) {
        <span class="text-3xl text-shadow-md text-shadow-white">در حال پیدا کردن بازیکن</span>
      } @else {
        <button (click)="start()" [disabled]="gameCore.finding()" class="btn">
          <span>شروع بازی</span>
        </button>
      }
    </div>

    <div class=" absolute bottom-14 flex flex-wrap justify-center gap-4 h-36 max-w-[80vw]">
      @for (item of gameCore.players(); track $index) {
        <app-player 
          name="{{item.name}}"
          avatar="{{item.avatar}}"
          class=" animate__bounceIn"
        />
      }
    </div>
  `,
  host: {
    class: 'flex flex-col items-center h-dvh relative'
  }
})
export class Home {
  public gameCore = inject(GameCore);
  private router = inject(Router);

  public async start() {
    var result = await this.gameCore.find();

    if (result) {
      await this.router.navigate(['/game'], {
        replaceUrl: true,
      });
    }
  }
}
