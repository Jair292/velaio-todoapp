import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/from-validators/validators';
import { PersonsComponent } from '../form-components/persons/persons.component';
import { ButtonDirective } from 'src/app/directives/button.directive';
import { ToDosService } from 'src/app/services/todos.service';
import { ToDo } from 'src/app/models/todo';

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
    persons: this.generatePersonsGroup(),
    endDate: ['', Validators.required],
  });

  get persons(): FormArray {
    return this.todoForm.get('persons') as FormArray;
  }

  generatePersonControl() {
    return this.fb.nonNullable.group({
      name: ['', [ Validators.required, Validators.minLength(5)]],
      age: ['', [Validators.required, Validators.min(18)]],
      skills: this.fb.nonNullable.array<FormControl<string>>(
        [this.fb.nonNullable.control<string>(
          '', [Validators.required]
        )], [Validators.minLength(1), CustomValidators.notDuplicates()])
    });
  }

  generatePersonsGroup() {
    return this.fb.nonNullable.array([
      this.generatePersonControl()
      ], [CustomValidators.notDuplicates()]);
  }

  onSubmit() {
    if (this.todoForm.invalid) {
      return
    }
    this.toDosService.addToDo(this.todoForm.value as Partial<ToDo>);
    this.todoForm.controls.persons.clear();
    this.todoForm.controls.persons.push(this.generatePersonControl());
    this.formDir.resetForm();
  }
}
