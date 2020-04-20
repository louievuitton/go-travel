import { AbstractControl, ValidationErrors } from '@angular/forms';

export class FormValidator {
  static cannotContainSpaces(
    control: AbstractControl
  ): ValidationErrors | null {
    if (control.value.indexOf(' ') >= 0) {
      return {
        cannotContainSpaces: true
      };
    } else {
      return null;
    }
  }
}
