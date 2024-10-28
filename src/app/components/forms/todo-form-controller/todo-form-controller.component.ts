import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToDosState } from '@store/store.reducers';
import * as storeActions from '@store/store.actions';


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
export class TodoFormControllerComponent implements OnInit {
  store = inject(Store<ToDosState>);

  ngOnInit() {
    this.store.dispatch(storeActions.skillsActions.getSkills());
  }
}
