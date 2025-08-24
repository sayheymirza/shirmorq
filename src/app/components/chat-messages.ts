import { Component, inject } from '@angular/core';
import { Chat } from '../services/chat';
import { Player } from "./player";

@Component({
  selector: 'app-chat-messages',
  imports: [Player],
  template: `
    @for (item of chat.messages(); track $index) {
      <div class="flex flex-nowrap gap-2">
        <app-player 
          [name]="item.player.name"
          [avatar]="item.player.avatar"
          class="h-fit"
        />

        <div class="bg-white shadow-lg p-2 mb-2 h-fit rounded-xl max-w-[calc(100vw-130px)] break-words text-xs">
          {{item.text}}
        </div>

      </div>
    }
  `,
  host: {
    class: 'flex flex-col-reverse px-2 h-[320px] overflow-y-scroll'
  }
})
export class ChatMessages {
  public chat = inject(Chat);

}
