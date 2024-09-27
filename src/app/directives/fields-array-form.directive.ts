import { CommonModule } from '@angular/common';
import { Directive, inject, Input } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

export const viewProviders = [
  {
    provide: ControlContainer,
    useFactory: () => inject(ControlContainer, {skipSelf: true}),
  }
];

export const commonImports = [CommonModule, ReactiveFormsModule];

@Directive()
export class FieldsArrayForm {
  @Input('group') formArray!: FormArray;
  @Input({required: true}) formArrayName: string = '';
  @Input() legend: string = '';

  fb = inject(FormBuilder);
  parentContainer = inject(ControlContainer);

  get parentFormGroup (): FormGroup {
    return this.parentContainer.control as FormGroup;
  }
}
