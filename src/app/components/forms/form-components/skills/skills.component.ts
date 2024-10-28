import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { commonImports, FormFields, viewProviders } from '@directives/form-fields.directive';
import { CustomValidators } from '@components/forms/from-validators/validators';
import { Store } from '@ngrx/store';
import { ToDosState } from '@store/store.reducers';
import { selectSkills } from '@store/store.selectors';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [...commonImports],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [...viewProviders],
})
export class SkillsComponent extends FormFields {
  store = inject(Store<ToDosState>);
  skillList$ = this.store.select(selectSkills);
  skills = this.createSkills();

  ngOnInit(): void {
    if (!this.formArray) {
      this.parentFormGroup.addControl(this.formArrayName, this.skills);
    } else {
      this.skills = this.formArray;
    }
  }

  createSkills() {
    return this.fb.array<FormControl<string>>(
      [this.createSkillControl()], [Validators.minLength(1), CustomValidators.notDuplicates()]);
  }

  createSkillControl() {
    return new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]});
  }

  addSkill() {
    if (this.skills.length > 2) return;
    this.skills.push(this.createSkillControl());
  }

  removeSkill(i: number) {
    if (this.skills.length < 2) return;
    this.skills.removeAt(i);
  }
}
