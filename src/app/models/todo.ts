import { AbstractControl, FormArray } from "@angular/forms";

export type Person = {
  name: string;
  age: number;
  skills: string[];
}

export type ToDo = {
  id: number;
  name: string;
  persons: Person[];
  endDate: Date;
  status: 'open' | 'closed';
};

export type ToDoForm = {
  name: AbstractControl;
  persons: FormArray<AbstractControl>;
  endDate: AbstractControl;
};
