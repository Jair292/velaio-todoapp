import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'src/app/directives/button.directive';
import { PersonsComponent } from '../form-components/persons/persons.component';
import { FORM_SUBMIT_TOKEN } from 'src/app/helpers/common';
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
  providers: [
    { provide: FORM_SUBMIT_TOKEN, useFactory: () => inject(TodoFormComponent).submitedTrigger$ },
  ],
})
export class TodoFormComponent {
  fb = inject(FormBuilder);
  submitedTrigger$ = new Subject<void>();
  store = inject(Store<ToDosState>);

  @ViewChild(FormGroupDirective) formDir!: FormGroupDirective;

  todoForm = this.createForm();

  ngOnInit() {
    this.store.dispatch(storeActions.skillsActions.getSkills());
  }

  createForm() {
    return this.fb.nonNullable.group({
      name: ['', [ Validators.required, Validators.minLength(5) ]],
      endDate: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.todoForm.invalid) {
      return;
    }
    // this.toDosService.addToDo(this.todoForm.value as Partial<ToDo>).subscribe();
    this.store.dispatch(storeActions.toDosActions.addToDo({ toDo: this.todoForm.value as Partial<ToDo> }));
    this.submitedTrigger$.next();
    this.formDir.resetForm();
  }
}
