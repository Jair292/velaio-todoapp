import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/from-validators/validators';
import { PersonsComponent } from '../form-components/persons/persons.component';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PersonsComponent],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoFormComponent implements OnInit {
  fb = inject(FormBuilder);
  todoForm = this.fb.nonNullable.group({
    name: ['', [ Validators.required, Validators.minLength(5) ]],
    persons: this.fb.array([
      this.fb.nonNullable.group({
        name: ['', [ Validators.required, Validators.minLength(5)]],
        age: ['', [Validators.required, Validators.min(18)]],
        skills: this.fb.nonNullable.array<AbstractControl<string>>([this.fb.nonNullable.control<string>('')], [CustomValidators.minLength(1)])
      })
      ], [CustomValidators.notDuplicates()]),
    endDate: ['', Validators.required],
  });

  get persons(): FormArray {
    return this.todoForm.get('persons') as FormArray;
  }


  ngOnInit() {
  }

  onSubmit() {
    console.log(this.todoForm.value);
  }

  addSkill(i: number) {
    (this.persons.controls[i].get('skills') as FormArray)?.push(new FormControl(''));
  }

  removeSkill(personIndex: number, skillIndex: number) {
    (this.persons.controls[personIndex].get('skills') as FormArray)?.removeAt(skillIndex);
  }
}
