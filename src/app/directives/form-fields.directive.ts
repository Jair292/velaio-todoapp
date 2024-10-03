import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Directive, inject, Input, OnDestroy } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { FORM_TOKEN } from '../helpers/common';

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
  formSubmited$= inject(FORM_TOKEN).submitedTrigger$;
  parentContainer = inject(ControlContainer);
  cdr = inject(ChangeDetectorRef);
  destroy$ = new Subject<boolean>();

  get parentFormGroup (): FormGroup {
    return this.parentContainer.control as FormGroup;
  }

  ngOnDestroy(): void {
    console.log('FormFields directive destroyed');
    this.destroy$.next(true);
    this.parentFormGroup?.removeControl(this.formArrayName);
  }
}
