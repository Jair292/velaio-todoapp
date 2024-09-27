import { AbstractControl, FormArray, FormControl, ValidationErrors } from "@angular/forms";

export type DuplicateNameError = { duplicated: boolean, name: string[] };

export class CustomValidators {

  static notDuplicates(key: string = 'name') {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!(control instanceof FormArray)) {
        return null;
      }

      const valueMap = new Set<string>();

      let result: DuplicateNameError = { duplicated: false, name: [] };

      for (let group of control.controls) {
        let nameControl;

        if (group instanceof FormControl) {
          nameControl = group;
        } else {
          nameControl = group.get(key);
        }
        if (nameControl) {
          const value = nameControl.value;
          if (valueMap.has(value)) {
            nameControl.setErrors({duplicated: true});
            result.duplicated = true;
            result.name.push(value);
          }
          valueMap.add(value);
        }
      }

      if (result.duplicated) {
        return result;
      }
      return null;
    }
  }
}
