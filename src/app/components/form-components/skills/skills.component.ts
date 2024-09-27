import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, ReactiveFormsModule, Validators } from '@angular/forms';
import { FieldsArrayForm } from 'src/app/directives/fields-array-form.directive';
import { CustomValidators } from 'src/app/from-validators/validators';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, {skipSelf: true}),
    }
  ]
})
export class SkillsComponent extends FieldsArrayForm {

  skills = this.fb.nonNullable.array<string>([], [CustomValidators.minLength(1)]);

  ngOnInit(): void {
    if (!this.formArray) {
      this.parentFormGroup.addControl(this.formArrayName, this.skills);
    } else {
      this.skills = this.formArray;
    }
  }

  ngOnDestroy(): void {
    this.parentFormGroup?.removeControl(this.formArrayName);
  }

  createSkillControl() {
    return this.fb.nonNullable.control('', [Validators.required]);
  }

  addSkill() {
    this.skills.push(this.createSkillControl());
  }

  removeSkill(i: number) {
    this.skills.removeAt(i);
  }
}
