import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { CustomValidators } from '@components/forms/from-validators/validators';
import { commonImports, FormFields, viewProviders } from '@directives/form-fields.directive';
import { SkillsComponent } from '../skills/skills.component';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [...commonImports, SkillsComponent],
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss'],
  viewProviders: [...viewProviders],
})
export class PersonsComponent extends FormFields implements OnInit {
  @Input() withSkills: boolean = false;
  persons = this.createPersons();

  ngOnInit(): void {
    if (!this.formArray) {
      this.parentFormGroup.addControl(this.formArrayName, this.persons);
    } else {
      this.persons = this.formArray;
    }
  }

  createPersons() {
    return this.fb.array([this.createPersonGroup()], [CustomValidators.notDuplicates()]);
  }

  createPersonGroup() {
    return this.fb.group({
      name: ['', [ Validators.required, Validators.minLength(5)]],
      age: ['', [Validators.required, Validators.min(19)]]
    })
  }

  addPerson() {
    if (this.persons.length > 2) return;
    const personGroup = this.createPersonGroup();
    this.persons.push(personGroup);
  }

  removePerson(i: number) {
    if (this.persons.length < 2) return;
    this.persons.removeAt(i);
  }
}
