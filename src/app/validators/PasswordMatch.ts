import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const newPassword = control.get('newPassword')?.value;
    const newRepeatPassword = control.get('newRepeatPassword')?.value;
    return newPassword && newRepeatPassword && newPassword !== newRepeatPassword
      ? { passwordsMismatch: true }
      : null;
  };
}
