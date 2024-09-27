import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/from-validators/validators';
import { commonImports, FieldsArrayForm, viewProviders } from 'src/app/directives/fields-array-form.directive';
import { SkillsComponent } from '../skills/skills.component';
import { ButtonDirective } from 'src/app/directives/button.directive';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [...commonImports, SkillsComponent, ButtonDirective],
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss'],
  viewProviders: [...viewProviders],
})
export class PersonsComponent extends FieldsArrayForm {

  persons = this.fb.nonNullable.array([this.createPersonGroup()], [CustomValidators.notDuplicates()]);

  ngOnInit(): void {
    if (!this.formArray) {
      this.parentFormGroup.addControl(this.formArrayName, this.persons);
    } else {
      this.persons = this.formArray;
    }
  }

  ngOnDestroy(): void {
    this.parentFormGroup?.removeControl(this.formArrayName);
  }

  createPersonGroup() {
    return this.fb.nonNullable.group({
      name: ['', [ Validators.required, Validators.minLength(5)]],
      age: ['', [Validators.required, Validators.min(18)]],
      skills: this.fb.nonNullable.array<FormControl<string>>([
        new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required]})
      ], [Validators.minLength(1), CustomValidators.notDuplicates()])
    })
  }

  addPerson() {
    const personGroup = this.createPersonGroup();
    this.persons.push(personGroup);
  }

  removePerson(i: number) {
    this.persons.removeAt(i);
  }
}
