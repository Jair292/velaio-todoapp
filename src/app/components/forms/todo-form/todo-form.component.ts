import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroupDirective, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from '@directives/button.directive';
import { PersonsComponent } from '../form-components/persons/persons.component';
import { Store } from '@ngrx/store';
import { ToDosState } from '@store/store.reducers';
import { ActivatedRoute } from '@angular/router';
import { EditToDoService, NewToDoService, ToDoFormService } from '@services/todo-form.service';
import { getToDoFormRouteParams, ToDoFormRouteParams } from '@helpers/route-params';
import { ToDo } from '@app/models/todo';

const formServiceFactory = (route: ActivatedRoute) => {
  const params: ToDoFormRouteParams | null = getToDoFormRouteParams(route);
  if (params?.toDoId) {
    return new EditToDoService(inject(Store<ToDosState>));
  }
  return new NewToDoService(inject(Store<ToDosState>));
}

const TODO_FORM_SERVICE = {
  provide: ToDoFormService,
  useFactory: formServiceFactory,
  deps: [ActivatedRoute],
}

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PersonsComponent, ButtonDirective],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TODO_FORM_SERVICE],
})
export class TodoFormComponent {
  fb = inject(NonNullableFormBuilder);
  store = inject(Store<ToDosState>);
  formService = inject(ToDoFormService);
  @Input() toDoId?: string;
  @ViewChild(FormGroupDirective) formDir!: FormGroupDirective;
  todoForm = this.createForm();

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
    this.formService.submit(this.todoForm.value as Partial<ToDo>);
    this.formDir.resetForm();
  }
}
