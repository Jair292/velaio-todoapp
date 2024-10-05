import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'src/app/directives/button.directive';
import { ToDosService } from 'src/app/services/todos.service';
import { PersonsComponent } from '../form-components/persons/persons.component';
import { FORM_TOKEN } from 'src/app/helpers/common';
import { Subject } from 'rxjs';
import { ToDo } from 'src/app/models/todo';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PersonsComponent, ButtonDirective],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: FORM_TOKEN, useExisting: TodoFormComponent },
  ],
})
export class TodoFormComponent {
  fb = inject(FormBuilder);
  toDosService = inject(ToDosService);
  submitedTrigger$ = new Subject<void>();

  @ViewChild(FormGroupDirective) formDir!: FormGroupDirective;

  todoForm = this.createForm();

  ngOnInit() {
    this.toDosService.requestSkills().subscribe();
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
    this.toDosService.addToDo(this.todoForm.value as Partial<ToDo>).subscribe();
    this.submitedTrigger$.next();
    this.formDir.resetForm();
  }
}
