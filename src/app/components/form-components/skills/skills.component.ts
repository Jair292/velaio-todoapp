import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { commonImports, FormFields, viewProviders } from 'src/app/directives/form-fields.directive';
import { CustomValidators } from 'src/app/from-validators/validators';
import { ButtonDirective } from 'src/app/directives/button.directive';
import { ToDosService } from 'src/app/services/todos.service';
import { trackByFn } from 'src/app/helpers/common';
import { takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [...commonImports, ButtonDirective],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [...viewProviders]
})
export class SkillsComponent extends FormFields {
  skillList$ = inject(ToDosService).skills$;
  skills = this.createSkills();
  trackByFn = trackByFn;

  changeObserver$ = this.skills.valueChanges;

  ngOnInit(): void {
    if (!this.formArray) {
      this.parentFormGroup.addControl(this.formArrayName, this.skills);
    } else {
      this.skills = this.formArray;
    }

    this.formSubmited$.pipe(
      tap(() => this.skills.controls.forEach(control => control.reset())),
      tap(() => this.cdr.markForCheck()),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  createSkills() {
    return this.fb.nonNullable.array<FormControl<string>>(
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
