import { Directive, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: 'button',
  standalone: true,
})
export class ButtonDirective implements OnChanges {
  @Input()
  primary = true;

  @HostBinding('class')
  class: string = 'btn btn-primary';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['primary']) {
      this.class = this.primary ? 'btn btn-primary' : 'btn btn-secondary';
    }
  }
}
