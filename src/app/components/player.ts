import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-player',
  imports: [NgClass],
  template: `
    <div 
      class="grid items-center justify-center"
      [ngClass]="{
        'grid-rows-2 justify-items-center': position() == 'bottom' || position() == 'top',
        'grid-cols-2 gap-2': position() == 'right',
      }"
    >
      <img src="{{avatar()}}" alt="{{name()}}" class="w-8 h-8 border-2 border-white rounded-full" />

      <span
        class=" truncate w-full"
        [ngClass]="{
          'row-start-1 text-left ': position() == 'right',
          'row-start-1 text-center': position() == 'top'
        }"
      >
        {{name()}}
      </span>
    </div>
  `,
})
export class Player {
  public name = input.required<string>();
  public avatar = input.required<string>();
  public position = input<'bottom' | 'top' | 'right'>('bottom');
}
