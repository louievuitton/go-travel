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

  static invalidEmail(control: AbstractControl): ValidationErrors | null {
    if (control.value.includes('@') && control.value.includes('.com')) {
      if (control.value.indexOf('@') >= control.value.indexOf('.com')) {
        return {
          invalidEmail: true
        };
      } else {
        return null;
      }
    } else {
      return {
        invalidEmail: true
      };
    }
  }

  static invalidPassword(control: AbstractControl): ValidationErrors | null {
    if (/[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?()\._]/g.test(control.value)) {
      return {
        invalidPassword: true
      };
    } else {
      return null;
    }
  }
}
