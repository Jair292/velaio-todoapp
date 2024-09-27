import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { commonImports, FieldsArrayForm, viewProviders } from 'src/app/directives/fields-array-form.directive';
import { CustomValidators } from 'src/app/from-validators/validators';
import { ButtonDirective } from 'src/app/directives/button.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [...commonImports, ButtonDirective],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [...viewProviders]
})
export class SkillsComponent extends FieldsArrayForm {

  skills = this.fb.nonNullable.array<FormControl<string>>(
    [this.createSkillControl()], [Validators.minLength(1), CustomValidators.notDuplicates()]);

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
    return new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]});
  }

  addSkill() {
    this.skills.push(this.createSkillControl());
  }

  removeSkill(i: number) {
    this.skills.removeAt(i);
  }
}
