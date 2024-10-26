import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroupDirective, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'src/app/directives/button.directive';
import { PersonsComponent } from '../form-components/persons/persons.component';
import { Subject } from 'rxjs';
import { ToDo } from 'src/app/models/todo';
import { Store } from '@ngrx/store';
import { ToDosState } from 'src/app/store/store.reducers';
import * as storeActions from 'src/app/store/store.actions';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PersonsComponent, ButtonDirective],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFormComponent {
  fb = inject(NonNullableFormBuilder);
  store = inject(Store<ToDosState>);
  @Input() todoId?: string;
  @ViewChild(FormGroupDirective) formDir!: FormGroupDirective;
  todoForm = this.createForm();

  ngOnInit() {
    this.store.dispatch(storeActions.skillsActions.getSkills());
  }

  createForm() {
    return this.fb.group({
      name: ['', [ Validators.required, Validators.minLength(5) ]],
      endDate: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.todoForm.invalid) {
      return;
    }
    this.store.dispatch(storeActions.toDoActions.addToDo({ toDo: this.todoForm.value as Partial<ToDo> }));
    this.formDir.resetForm();
  }
}
