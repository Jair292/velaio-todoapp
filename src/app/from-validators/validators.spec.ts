import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { CustomValidators } from './validators';

describe('CustomValidators', () => {
  describe('notDuplicates', () => {
    it('should return null if control is not a FormArray', () => {
      const control = new FormControl('test');
      const validator = CustomValidators.notDuplicates();
      expect(validator(control)).toBeNull();
    });

    it('should return null if no duplicates are found', () => {
      const formArray = new FormArray([
        new FormControl('test1'),
        new FormControl('test2'),
      ]);
      const validator = CustomValidators.notDuplicates();
      expect(validator(formArray)).toBeNull();
    });

    it('should return error if duplicates are found', () => {
      const formArray = new FormArray([
        new FormControl('test1'),
        new FormControl('test1'),
      ]);
      const validator = CustomValidators.notDuplicates();
      const result = validator(formArray);
      expect(result).not.toBeNull();
      // expect(result.duplicated).toBe(true);
      // expect(result.name).toEqual(['test1']);
    });

    it('should return error if duplicates are found in nested form groups', () => {
      const formGroup1 = new FormGroup({
        name: new FormControl('test1'),
      });
      const formGroup2 = new FormGroup({
        name: new FormControl('test1'),
      });
      const formArray = new FormArray([formGroup1, formGroup2]);
      const validator = CustomValidators.notDuplicates('name');
      const result = validator(formArray);
      expect(result).not.toBeNull();
      // expect(result.duplicated).toBe(true);
      // expect(result.name).toEqual(['test1']);
    });
  });
});
