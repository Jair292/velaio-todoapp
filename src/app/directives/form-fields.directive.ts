import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, DestroyRef, Directive, Inject, inject, Input, OnDestroy, Optional } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { FORM_SUBMIT_TOKEN } from '../helpers/common';

export const viewProviders = [
  {
    provide: ControlContainer,
    useFactory: () => inject(ControlContainer, {skipSelf: true}),
  }
];

export const commonImports = [CommonModule, ReactiveFormsModule];

@Directive()
export class FormFields implements OnDestroy {
  @Input('data') formArray!: FormArray;
  @Input({required: true}) formArrayName: string = '';
  @Input() legend: string = '';

  fb = inject(FormBuilder);
  formSubmited$ = inject(FORM_SUBMIT_TOKEN, {optional: true});
  parentContainer = inject(ControlContainer);
  cdr = inject(ChangeDetectorRef);
  dr = inject(DestroyRef);

  get parentFormGroup (): FormGroup {
    return this.parentContainer.control as FormGroup;
  }

  ngOnDestroy(): void {
    this.parentFormGroup?.removeControl(this.formArrayName);
  }
}
