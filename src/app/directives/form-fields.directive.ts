import { CommonModule } from '@angular/common';
import { DestroyRef, Directive, inject, Input, OnDestroy } from '@angular/core';
import { ControlContainer, FormArray, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective } from 'src/app/directives/button.directive';

export const viewProviders = [
  {
    provide: ControlContainer,
    useFactory: () => inject(ControlContainer, {skipSelf: true}),
  }
];

export const commonImports = [CommonModule, ReactiveFormsModule, ButtonDirective];

@Directive()
export class FormFields implements OnDestroy {
  @Input('data') formArray!: FormArray;
  @Input({required: true}) formArrayName: string = '';
  @Input() legend: string = '';

  fb = inject(NonNullableFormBuilder);
  parentContainer = inject(ControlContainer);

  get parentFormGroup (): FormGroup {
    return this.parentContainer.control as FormGroup;
  }

  ngOnDestroy(): void {
    this.parentFormGroup?.removeControl(this.formArrayName);
  }
}
