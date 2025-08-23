import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  template: `
    @if(position() == 'top' || position() == 'both') {
      <div class="flex flex-nowrap items-center mb-2 z-10">
        <span class="text-xl font-bold z-10 px-2">
          {{text()}}
        </span>
        <div class="flex-1"></div>
        @if(selected() != null) {
          <button class="bg-amber-200 rounded-full px-3 h-6 text-sm flex items-center justify-center">
            <span class="mt-1">{{selected() ? 'عدم انتخاب' : 'انتخاب'}}</span>
          </button>
        }
      </div>
    }

    <div class="rounded-lg w-full h-[315px] bg-amber-200 relative">
      <img src="/chicken.png" alt="{{text()}}" class="scale-150 -ms-4" />
    </div>

    @if(position() == 'bottom' || position() == 'both') {
      <div class="flex flex-nowrap items-center z-10 py-2 bg-white">
        <span class="text-xl font-bold z-10 px-2">
          {{text()}}
        </span>
        <div class="flex-1"></div>
        @if(selected() != null) {
          <button class="bg-amber-200 rounded-full px-3 h-6 text-sm flex items-center justify-center">
            <span class="mt-1">{{selected() ? 'عدم انتخاب' : 'انتخاب'}}</span>
          </button>
        }
      </div>
    }
  `,
  host: {
    class: 'flex flex-col p-4 bg-white rounded-xl shadow-2xl overflow-hidden'
  }
})
export class Card {
  public selected = input<boolean | null>(null);
  public text = input.required();
  public image = input<string | undefined>(undefined);
  public position = input<'top' | 'bottom' | 'both'>('top');
}
