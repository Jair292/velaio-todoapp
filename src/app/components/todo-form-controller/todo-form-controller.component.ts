import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-todo-form-controller',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet/>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoFormControllerComponent {

}
