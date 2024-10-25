import { Directive, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: 'button,a',
  standalone: true,
})
export class ButtonDirective implements OnChanges {
  @Input()
  size = 'normal';

  @HostBinding('class')
  class: string = 'btn';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['size']) {
      this.class = `btn ${this.size}`;
    }
  }
}
