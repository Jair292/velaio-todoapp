import { Directive, inject, Input } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Directive()
export class FieldsArrayForm {
  @Input('group') formArray!: FormArray;
  @Input({required: true}) formArrayName: string = '';
  @Input() label: string = 'Skills';

  fb = inject(FormBuilder);
  parentContainer = inject(ControlContainer);

  get parentFormGroup (): FormGroup {
    return this.parentContainer.control as FormGroup;
  }
}
