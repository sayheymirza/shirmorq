import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, input } from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [],
  template: `
    <div class="flex flex-nowrap items-center px-2 h-12 z-1">
      <button (click)="ref.close()" class="btn btn-icon btn-xs btn-red">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#ffffff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
      </button>

      <strong class="z-1 text-center font-bold text-lg mx-auto text-border text-border-base">{{title()}}</strong>

      <div class="block w-12 h-12"></div>
    </div>

    <div class="p-4 rounded-xl z-1 mx-2 mb-2 bg-gradient-to-b from-white to-white via-gray-100 inset-shadow-sm">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    class: 'dialog'
  }
})
export class Dialog {
  public ref = inject(DialogRef);

  public title = input<string>('');
}
