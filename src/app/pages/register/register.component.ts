import { Component, OnInit, ViewChild } from '@angular/core';
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
import { AuthService } from 'src/app/services/Auth/auth.service';
import { LoaderService } from 'src/app/services/Loader/loader.service';
import { CityService } from 'src/app/services/City/city.service';
import { MessageService } from 'primeng/api';
import { City } from 'src/app/interfaces/misc/city';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';

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
export class RegisterComponent implements OnInit {
  cities: City[] = [];
  buttonIcon: string = 'pi pi-sync';
  buttonClass: string = '';
  usernameTaken: boolean = false;

  registerForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^(?!\d)[a-zA-Z0-9]/)
      ]
    ],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    cityId: [null, Validators.required],
    avatarUrl: [null]
  });

  @ViewChild(ImageUploaderComponent) imageUploader!: ImageUploaderComponent;

  constructor(
    private fb: FormBuilder,
    private formUtils: FormUtilsService,
    private authService: AuthService,
    private cityService: CityService,
    private messageService: MessageService,
    private loaderService: LoaderService,
    private errorInterceptor: ErrorInterceptorService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loaderService.show();
    try {
      this.cities = await this.cityService.getCities();
    } catch (error) {
      this.errorInterceptor.handleError(error as AxiosError);
    } finally {
      this.loaderService.hide();
    }
  }

  get username() {
    return this.registerForm.get('username')?.value;
  }

  get selectedCity() {
    return this.registerForm.get('cityId')?.value;
  }

  /**
   * Checks the availability of the username and displays a message accordingly.
   * If the username is not provided, an info message is displayed.
   * If the username is taken, an error message is displayed.
   */
  async checkUsername(): Promise<void> {
    if (!this.username) {
      this.messageService.add({
        severity: 'info',
        summary: 'Unesite korisničko ime',
        detail: 'Nakon unosa provjerite dostupnost korisničkog imena'
      });
      return;
    }

    this.buttonIcon = 'pi pi-spin pi-spinner';
    this.buttonClass = '';

    try {
      this.usernameTaken = await this.authService.checkUsername(this.username);
      if (this.usernameTaken) {
        this.messageService.add({
          severity: 'error',
          summary: 'Korisničko ime zauzeto',
          detail: 'Odaberite drugo korisničko ime'
        });
      }
    } catch (error) {
      this.errorInterceptor.handleError(error as AxiosError);
    } finally {
      this.setButtonProperties(this.usernameTaken);
    }
  }

  setButtonProperties(usernameTaken: boolean): void {
    this.buttonIcon = usernameTaken ? 'pi pi-times' : 'pi pi-check';
    this.buttonClass = usernameTaken ? 'p-button-danger' : 'p-button-success';
  }

  isFieldInvalid(controlName: string): boolean {
    return this.formUtils.isTouchedAndInvalid(this.registerForm, controlName);
  }

  /**
   * Registers a user.
   *
   * @returns A Promise that resolves when the registration is successful.
   */
  async register(): Promise<void> {
    if (this.registerForm.valid && !this.usernameTaken) {
      this.loaderService.show();

      try {
        const imageUrl = await this.imageUploader.uploadImage();
        if (imageUrl) {
          this.registerForm.patchValue({ avatarUrl: imageUrl });
        }

        const signupData = this.registerForm.value;
        let city = this.cities.find(
          (city) => city.id === this.registerForm.value.cityId
        );

        if (!city) {
          const newCity: City = await this.cityService.createCity({
            name: this.registerForm.value.cityId
          });
          signupData.cityId = newCity?.id;
        }

        await this.authService.signup(signupData);
        this.messageService.add({
          severity: 'success',
          summary: 'Registracija uspješna',
          detail: 'Molimo provjerite svoj email za aktivaciju naloga.'
        });
      } catch (error) {
        this.errorInterceptor.handleError(error as AxiosError);
      } finally {
        this.loaderService.hide();
      }
    } else {
      this.registerForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Neispravni podaci',
        detail: 'Molimo ispravite neispravne podatke u formi.'
      });
    }
  }

  onImageUploaded(imageUrl: string | null): void {
    if (imageUrl) {
      this.registerForm.patchValue({ avatarUrl: imageUrl });
    }
  }
}
