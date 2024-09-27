import { AbstractControl, FormArray, ValidationErrors } from "@angular/forms";

type DuplicateNameError = { duplicated: boolean, name: string[] };

export class CustomValidators {

  static minLength(length: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const skillsArray = control as FormArray;
      return skillsArray.length > length ? null : { minLength: 1 };
    };
  }

  static notDuplicates(key: string = 'name') {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!(control instanceof FormArray)) {
        return null;
      }

      const nameMap = new Set<string>();

      let result: DuplicateNameError = { duplicated: false, name: [] };

      for (let group of control.controls) {
        const nameControl = group.get(key);
        if (nameControl) {
          const name = nameControl.value;
          if (nameMap.has(name)) {
            nameControl.setErrors({duplicated: true});
            result.duplicated = true;
            result.name.push(name);
          }
          nameMap.add(name);
        }
      }

      if (result.name.length > 0) {
        return result;
      }
      return null;
    }
  }
}
