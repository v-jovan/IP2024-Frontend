import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormUtilsService } from 'src/app/services/FormUtils/form-utils.service';
import { ImageUploaderComponent } from '../../components/image-uploader/image-uploader.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
    ImageUploaderComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(
    private fb: FormBuilder,
    private formUtils: FormUtilsService
  ) {}

  usernameTaken: boolean = false;

  registerForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    city: [null, Validators.required]
  });
  cities: any[] = [
    { name: 'Pariz', id: 1 },
    { name: 'London', id: 2 },
    { name: 'New York', id: 3 },
    { name: 'Tokyo', id: 4 },
    { name: 'Berlin', id: 5 }
  ];
  buttonIcon: string = 'pi pi-sync';
  buttonClass: string = '';

  get username() {
    return this.registerForm.get('username')?.value;
  }

  checkUsername(): void {
    if (!this.username) {
      return;
    }
    this.buttonIcon = 'pi pi-spin pi-spinner';
    this.buttonClass = '';
    setTimeout(() => {
      const taken = Math.random() > 0.5;
      this.usernameTaken = taken;
      this.buttonIcon = taken ? 'pi pi-times' : 'pi pi-check';
      this.buttonClass = taken ? 'p-button-danger' : 'p-button-success';
      console.log(
        `Username ${this.username} is ${taken ? 'taken' : 'available'}`
      );
    }, 1000);
  }

  isFieldInvalid(controlName: string): boolean {
    return this.formUtils.isInvalid(this.registerForm, controlName);
  }

  register(): void {
    if (this.registerForm.valid && !this.usernameTaken) {

      try {
        
      }
      catch (error) {
        console.error('Error registering user');
      }
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
