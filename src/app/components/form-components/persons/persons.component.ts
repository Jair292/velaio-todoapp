import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/from-validators/validators';
import { commonImports, FieldsArrayForm, viewProviders } from 'src/app/directives/fields-array-form.directive';
import { SkillsComponent } from '../skills/skills.component';
import { ButtonDirective } from 'src/app/directives/button.directive';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [...commonImports, SkillsComponent, ButtonDirective],
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss'],
  viewProviders: [...viewProviders],
})
export class PersonsComponent extends FieldsArrayForm implements OnInit, OnDestroy {

  persons = this.fb.nonNullable.array([this.createPersonGroup()], [CustomValidators.notDuplicates()]);
  destroy$ = new Subject<boolean>();

  ngOnInit(): void {
    if (!this.formArray) {
      this.parentFormGroup.addControl(this.formArrayName, this.persons);
    } else {
      this.persons = this.formArray;
    }

    this.persons.valueChanges.pipe(
      tap(values => {
        if (!values.length) {
          this.addPerson();
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.parentFormGroup?.removeControl(this.formArrayName);
    this.destroy$.next(true);
  }

  createPersonGroup() {
    return this.fb.nonNullable.group({
      name: ['', [ Validators.required, Validators.minLength(5)]],
      age: ['', [Validators.required, Validators.min(19)]],
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
