import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {
  getControl(form: FormGroup, controlName: string) {
    return form.get(controlName);
  }

  isFieldInvalid(form: FormGroup, controlName: string): boolean {
    const field = this.getControl(form, controlName);
    return (field?.touched && field?.invalid) || false;
  }
}
