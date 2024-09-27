import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/from-validators/validators';
import { ButtonDirective } from 'src/app/directives/button.directive';
import { ToDosService } from 'src/app/services/todos.service';
import { ToDo } from 'src/app/models/todo';
import { PersonsComponent } from '../form-components/persons/persons.component';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PersonsComponent, ButtonDirective],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoFormComponent {
  fb = inject(FormBuilder);
  toDosService = inject(ToDosService);

  @ViewChild(FormGroupDirective) formDir!: FormGroupDirective;

  todoForm = this.fb.nonNullable.group({
    name: ['', [ Validators.required, Validators.minLength(5) ]],
    endDate: ['', Validators.required],
  });

  onSubmit() {
    if (this.todoForm.invalid) {
      return;
    }
    this.toDosService.addToDo(this.todoForm.value as Partial<ToDo>);
    this.personArrayUpdate();
    this.formDir.resetForm();
  }

  personArrayUpdate() {
    const persons = this.todoForm.get('persons');
    if (persons instanceof FormArray) {
      persons.clear();
    }
  }
}
