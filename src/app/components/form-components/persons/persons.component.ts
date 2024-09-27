import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/from-validators/validators';
import { FieldsArrayForm } from 'src/app/directives/fields-array-form.directive';
import { SkillsComponent } from '../skills/skills.component';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SkillsComponent],
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, {skipSelf: true}),
    }
  ]
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
    return this.fb.group({
      name: ['', [ Validators.required, Validators.minLength(5)]],
      age: ['', [Validators.required, Validators.min(18)]],
      skills: this.fb.array<string>([], [CustomValidators.minLength(1)])
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
